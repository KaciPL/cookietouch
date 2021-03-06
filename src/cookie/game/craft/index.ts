import Account from "@/account";
import { AccountStates } from "@/account/AccountStates";
import ObjectEntry from "@/game/character/inventory/ObjectEntry";
import ExchangeCraftResultMessage from "@/protocol/network/messages/ExchangeCraftResultMessage";
import ExchangeCraftResultWithObjectDescMessage from "@/protocol/network/messages/ExchangeCraftResultWithObjectDescMessage";
import ExchangeObjectAddedMessage from "@/protocol/network/messages/ExchangeObjectAddedMessage";
import ExchangeReplayCountModifiedMessage from "@/protocol/network/messages/ExchangeReplayCountModifiedMessage";
import ExchangeStartOkCraftMessage from "@/protocol/network/messages/ExchangeStartOkCraftMessage";
import ExchangeStartOkCraftWithInformationMessage from "@/protocol/network/messages/ExchangeStartOkCraftWithInformationMessage";
import ObjectItemToSell from "@/protocol/network/types/ObjectItemToSell";
import LiteEvent from "@/utils/LiteEvent";

export default class Craft {
  public remoteObjects: ObjectEntry[];
  public objects: ObjectEntry[];
  public objectsInfos: ObjectItemToSell[];
  public remoteCurrentWeight: number = 0;
  public currentWeight: number = 0;
  public nbCase: number = 0;
  public skillid: number = 0;

  private account: Account;
  private readonly onCraftStarted = new LiteEvent<void>();
  private readonly onCraftLeft = new LiteEvent<void>();
  private readonly onCraftQuantityChanged = new LiteEvent<void>();

  constructor(account: Account) {
    this.account = account;
    this.objectsInfos = [];
    this.remoteObjects = [];
    this.objects = [];
  }

  public get CraftStarted() {
    return this.onCraftStarted.expose();
  }

  public get CraftLeft() {
    return this.onCraftLeft.expose();
  }

  public get CraftQuantityChanged() {
    return this.onCraftQuantityChanged.expose();
  }

  public setRecipe(gid: number): boolean {
    this.account.network.sendMessageFree("ExchangeSetCraftRecipeMessage", {
      objectGID: gid
    });
    return true;
  }

  public setQuantity(qty: number): boolean {
    this.account.network.sendMessageFree("ExchangeReplayMessage", {
      count: qty
    });
    return true;
  }

  public ready(): boolean {
    this.account.network.sendMessageFree("ExchangeReadyMessage", {
      ready: true,
      step: 2
    });
    return true;
  }

  public async UpdateExchangeObjectAddedMessage(
    message: ExchangeObjectAddedMessage
  ) {
    const newObj = await ObjectEntry.setup(message.object);
    if (message.remote) {
      this.remoteObjects.push(newObj);
      this.remoteCurrentWeight += newObj.realWeight * newObj.quantity;
    } else {
      this.objects.push(newObj);
      this.currentWeight += newObj.realWeight * newObj.quantity;
    }
    this.onCraftStarted.trigger();
  }

  public async UpdateExchangeReplayCountModifiedMessage(
    message: ExchangeReplayCountModifiedMessage
  ) {
    this.onCraftQuantityChanged.trigger();
  }

  public async UpdateExchangeStartOkCraftWithInformationMessage(
    message: ExchangeStartOkCraftWithInformationMessage
  ) {
    this.account.state = AccountStates.EXCHANGE;
    this.nbCase = message.nbCase;
    this.skillid = message.skillId;
    this.onCraftStarted.trigger();
  }

  public async UpdateExchangeCraftResultMessage(
    message: ExchangeCraftResultMessage
  ) {
    this.onCraftLeft.trigger();
  }

  public async UpdateExchangeCraftResultWithObjectDescMessage(
    message: ExchangeCraftResultWithObjectDescMessage
  ) {
    this.onCraftLeft.trigger();
  }

  public async UpdateExchangeStartOkCraftMessage(
    message: ExchangeStartOkCraftMessage
  ) {
    this.account.state = AccountStates.EXCHANGE;
    this.onCraftStarted.trigger();
  }
}
