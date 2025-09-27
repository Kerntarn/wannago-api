// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { AdService } from '../ad/ad.service';
// import { Ad, AdDocument } from '../schemas/ad.schema';
// import { AdStatus } from 'src/ad/ad.asset';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';

// @Injectable()
// export class AdsCronService {
//     constructor(
//         @InjectModel(Ad.name) private adModel: Model<AdDocument>,
//     ) {}

//   @Cron('0 * * * *')
//   async checkExpiredAds() {
//     const now = new Date();
//     await this.adModel.updateMany(
//     { status: AdStatus.ACTIVE, expireAt: { $lte: now } },
//     { $set: { status: AdStatus.EXPIRED } },
//   );
//   }

// }