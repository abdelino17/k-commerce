import { Container } from 'inversify';
import {TAGS, TYPES, WebService} from './Types';
import { PrestaShop } from '../entities/PrestaShop';

let container = new Container();

container.bind<WebService>(TYPES.WebService).to(PrestaShop).whenTargetNamed(TAGS.PrestaShop);

export default container;
