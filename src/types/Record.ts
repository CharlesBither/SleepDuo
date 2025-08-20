export type Record = {
    "id"?: number,
    "created_at": Date,
    "uuid": string,
    "journal_date": string,
    "content": {
      "alcohol_quantity": string,
      "caffiene_quantity": string,
      "wake_date": string,
      "sleep_date": string,
      "alcohol_date"?: string,
      "caffiene_date"?: string
    } 
}

export type Content = {
  "alcohol_quantity": string,
  "caffiene_quantity": string,
  "wake_date": string,
  "sleep_date": string,
  "alcohol_date"?: string,
  "caffiene_date"?: string
} 

export const constructRecord = (
    uuid: string, wakeDate: Date, sleepDate: Date,
    alcoholQuantity: string, caffieneQuantity: string,
    alcoholDate?: Date, caffieneDate?: Date    
): Record => {
    return {
      "created_at": new Date(),
      "uuid": uuid,
      "journal_date": wakeDate.toDateString(),
      "content": {
        "alcohol_quantity": alcoholQuantity,
        "caffiene_quantity": caffieneQuantity,
        "wake_date": wakeDate.toJSON(),
        "sleep_date": sleepDate.toJSON(),
        "alcohol_date": alcoholDate?.toJSON(),
        "caffiene_date": caffieneDate?.toJSON()
      } 
    }
}

export const constructRecordWithId = (
    id: number, uuid: string, wakeDate: Date, sleepDate: Date,
    alcoholQuantity: string, caffieneQuantity: string,
    alcoholDate?: Date, caffieneDate?: Date    
): Record => {
    return {
      "id": id,
      "created_at": new Date(),
      "uuid": uuid,
      "journal_date": wakeDate.toDateString(),
      "content": {
        "alcohol_quantity": alcoholQuantity,
        "caffiene_quantity": caffieneQuantity,
        "wake_date": wakeDate.toJSON(),
        "sleep_date": sleepDate.toJSON(),
        "alcohol_date": alcoholDate?.toJSON(),
        "caffiene_date": caffieneDate?.toJSON()
      } 
    }
}