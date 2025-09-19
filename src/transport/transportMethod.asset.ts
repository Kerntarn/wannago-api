export enum TransportType {
    CAR = 'Car',                 
    TAXI = 'Taxi',                   
    VAN = 'Van/Minibus',              
    BUS = 'Bus',                      
    MOTORBIKE_TAXI = 'Motorbike Taxi',
    CAR_RENTAL = 'Car Rental',        
    MOTORBIKE_RENTAL = 'Motorbike Rental' 
}

export const defaultTransportPrices: Record<TransportType, number> = {
  [TransportType.CAR]: 7,
  [TransportType.TAXI]: 12,
  [TransportType.VAN]: 9,
  [TransportType.BUS]: 3,
  [TransportType.MOTORBIKE_TAXI]: 10,
  [TransportType.CAR_RENTAL]: 20,
  [TransportType.MOTORBIKE_RENTAL]: 7,
};