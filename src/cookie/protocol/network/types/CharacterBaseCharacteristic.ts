import Type from "./Type";

export default class CharacterBaseCharacteristic extends Type {

  public base: number;
  public objectsAndMountBonus: number;
  public alignGiftBonus: number;
  public contextModif: number;

  get total() {
    return this.base + this.objectsAndMountBonus + this.alignGiftBonus + this.contextModif;
  }

  constructor(base = 0, objectsAndMountBonus = 0, alignGiftBonus = 0, contextModif = 0) {
    super();
    this.base = base;
    this.objectsAndMountBonus = objectsAndMountBonus;
    this.alignGiftBonus = alignGiftBonus;
    this.contextModif = contextModif;
  }
}
