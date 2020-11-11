import getQueryStringParams from '../shared/getQueryStringParams';
import environment from './environment';
import project from './project';
import Router from './router';
import generator from './generator';
import paramsProxyHandler from './paramsProxyHandler';
import render from './render';

export async function prerender(request, response) {
  const page = {image: '/image-1200x630.png'};
  const clientEnvironment = {...environment, prerendered: true};
  const clientContext = {page, project, environment: clientEnvironment};
  const clientContextProxyHandler = {
    set(target, name, value) {
      clientContext[name] = value;
      return Reflect.set(...arguments);
    }
  }
  const instances = {};
  const routes = {};
  const scope = {instances, request, routes, response};
  const [path, query] = request.originalUrl.split('?');
  scope.params = getQueryStringParams(query);
  scope.generateContext = (temporary) => {
    const params = temporary.params ? {...temporary.params, ...clientContext.params} : clientContext.params;
    temporary.params = new Proxy(params, paramsProxyHandler);
    return new Proxy({...clientContext, ...temporary}, clientContextProxyHandler);
  }
  scope.findParentInstance = (depth) => {
    for(let i = 0; i < depth.length; i++) {
      const key = depth.slice(0, i * -1).join('.');
      if(scope.instances[key]) {
        return scope.instances[key];
      }
    }
  }
  clientContext.router = new Router(scope);
  const virtualDom = generator.starter();
  const html = await render(virtualDom, [0], scope);
  const memory = {};
  for(const key in scope.instances) {
    memory[key] = scope.instances[key].serialize();
  }
  return {html, memory, representation: virtualDom, context: clientContext, page, project, environment: clientEnvironment};
}