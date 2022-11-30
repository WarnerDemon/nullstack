/* eslint-disable nullstack/no-undef */
import Nullstack from 'nullstack'

class UndefinedNodes extends Nullstack {

  renderWithoutReturn() {
    // eslint-disable-next-line nullstack/prettier
    <div> forgot to return </div>
  }

  renderWithUndefinedReturn() {
    return
  }

  render({ params }) {
    return (
      <div>
        {params.withoutReturn && <WithoutReturn />}
        {params.withoutUndefinedReturn && <WithUndefinedReturn />}
        {params.withoutRetunr && <WithoutRetunr />}
        {params.forgotToImport && <ForgotToImport />}
        {params.undeclaredVariable && <div data-undeclared-variable>{this.undeclaredVariable}</div>}
      </div>
    )
  }

}

export default UndefinedNodes
