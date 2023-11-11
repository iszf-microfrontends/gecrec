import { api } from '~/shared/api';
import { Form, formFactory } from '~/widgets/form';

const formModel = formFactory.createModel({ api });

const Content = (): JSX.Element => <Form model={formModel} />;

export default Content;
