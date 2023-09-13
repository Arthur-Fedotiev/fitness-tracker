import { TranslatedData, Translations } from '../models/translation.interfaces';
export declare const mapTranslatedData: <T extends object>(data: TranslatedData<T>, transformersMap?: Partial<Record<keyof T, (data: any) => any>>) => Translations<T>;
