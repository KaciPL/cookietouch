import GlobalConfiguration from "@/configurations/GlobalConfiguration";
import { Languages } from "@/configurations/language/Languages";
import { staticPath } from "@/utils/staticPath";
import * as fs from "fs";
import * as path from "path";

export default class LanguageManager {
  private static langs: Map<Languages, any>;

  public static Init() {
    const enFile = fs.readFileSync(path.join(staticPath, "./langs/en.json"));
    const en = JSON.parse(enFile.toString());
    const frFile = fs.readFileSync(path.join(staticPath, "./langs/fr.json"));
    const fr = JSON.parse(frFile.toString());
    const esFile = fs.readFileSync(path.join(staticPath, "./langs/es.json"));
    const es = JSON.parse(esFile.toString());
    const itFile = fs.readFileSync(path.join(staticPath, "./langs/it.json"));
    const it = JSON.parse(itFile.toString());
    const deFile = fs.readFileSync(path.join(staticPath, "./langs/de.json"));
    const de = JSON.parse(deFile.toString());
    const ptFile = fs.readFileSync(path.join(staticPath, "./langs/pt.json"));
    const pt = JSON.parse(ptFile.toString());

    this.langs = new Map([
      [Languages.FRENCH, fr],
      [Languages.ENGLISH, en],
      [Languages.DEUTSCH, de],
      [Languages.ITALIAN, it],
      [Languages.PORTUGUESE, pt],
      [Languages.SPANISH, es]
    ]);
  }

  public static trans(key: string, ...params: any[]): string {
    const pathh = key.split(".");
    const lang = this.langs.get(GlobalConfiguration.lang);
    const elang = this.langs.get(Languages.ENGLISH);

    let value;
    let evalue;

    for (const p of pathh) {
      value = value ? value[p] : lang[p];
      evalue = evalue ? evalue[p] : elang[p];
      if (!value) {
        value = evalue;
      }
    }

    if (params.length === 0) {
      return value;
    } else {
      for (const param of params) {
        value = value.replace("?", param);
      }
      return value;
    }
  }
}
