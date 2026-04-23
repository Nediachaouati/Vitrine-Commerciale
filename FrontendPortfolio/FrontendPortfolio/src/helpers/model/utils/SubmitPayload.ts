import { MethodFormEnum } from '../enum/method.form.enum';

export type SubmitPayload = { method: MethodFormEnum.DEL } | { method: MethodFormEnum.ADD | MethodFormEnum.PUT; values: any };
