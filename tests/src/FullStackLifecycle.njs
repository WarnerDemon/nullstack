import Nullstack from 'nullstack';

class FullStackLifecycle extends Nullstack {

  prepared = false;
  initiated = false;
  launched = true;
  hydrated = false;
  updated = false;

  prepare() {
    this.prepared = true;
  }

  async initiate() {
    this.initiated = true;
  }

  launch() {
    this.launched = true
  }

  hydrate() {
    this.hydrated = true;
  }

  update() {
    if (!this.updated) {
      this.updated = true;
    }
  }

  async terminate({ params }) {
    params.terminated = true;
  }

  render() {
    return (
      <div class="FullStackLifecycle">
        <div data-prepared={this.prepared} />
        <div data-initiated={this.initiated} />
        <div data-launched={this.launched} />
        <div data-hydrated={this.hydrated} />
        <div data-updated={this.updated} />
        <a href="/"> Terminate </a>
      </div>
    )
  }

}

export default FullStackLifecycle;