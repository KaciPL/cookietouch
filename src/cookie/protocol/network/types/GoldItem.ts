import Item from "./Item";

export default class GoldItem extends Item {
  public sum: number;
  constructor(sum = 0) {
    super();
    this.sum = sum;
  }
}
