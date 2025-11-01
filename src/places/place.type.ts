//optional: what we send back to the one who requested
export class PlaceUserType {
    name: string;    
    imageUrl: string
    location: number[];
    description: string;
    type: string;
    startTime?: Date;
    endTime?: Date;
    openHours?: string;
    stayMin?: number;
}