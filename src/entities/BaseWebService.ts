import { injectable } from 'inversify';


@injectable()
abstract  class BaseWebService {

    protected __string() {
        console.log( (<any>this).constructor.name)
    }
}

export { BaseWebService }