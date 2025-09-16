export const TransactionMessages = {
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_FETCHED: 'Transaction fetched successfully',
  TRANSACTION_UPDATED: 'Transaction updated successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully',
  TRANSACTION_NOT_CREATED: 'Transaction Not Created',
  TRANSACTION_ACCEPTED: 'Transaction accepted',
  TRANSACTION_REJECTED: 'Transaction Rejected',
  INVALID_TYPE: 'Invalid transaction type',
  TRANSACTION_NOT_UPDATED: 'Transaction Not updated ',
  INVALID_TRANSACTION_ID: 'Invalid Transaction Id',
  TRANSACTION_ZERO: 'You Dont Have Any Transactions',
};

export enum TransactionStatus {
      PENDING = 'Pending',  
      SUCCESS = 'Success',   
      FAILED = 'Failed',     
      CANCELLED = 'Cancelled', 
}

export enum PaymentMethod {
      VISA = 'Visa',
      MASTERCARD = 'MasterCard',
      QR = 'QR Payment',
      PROMPTPAY = 'PromptPay',
      MOBILE = 'Mobile Banking',
}

export enum AdvertiserType{
      ACCOMMODATION = 'Accommodation',
      RESTAURANT = 'Restaurant',
      ATTRACTION = 'Attraction',
      CARRENTAL = 'CarRental',     
      BUSSERVICE = 'BusService',     
      AIRLINE = 'Airline',         
}

export enum AdDuration {
    DAYS_7 = 7,
    DAYS_15 = 15,
    DAYS_30 = 30,
    DAYS_60 = 60,
}