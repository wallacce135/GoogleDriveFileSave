import { Injectable } from '@nestjs/common';
import { File } from './interfaces/file.interface';
import { ConfigService } from '@nestjs/config/dist/config.service';

const { google } = require('googleapis')
const fs = require('fs')

@Injectable()
export class AppService {

  constructor(
    private readonly configService: ConfigService
  ) { }

  async uploadFile(file: File){
    try{

      const CLIENT_ID = this.configService.get("CLIENT_ID");
      const CLIENT_SECRET = this.configService.get("CLIENT_SECRET");
      const REFRESH_TOKEN = this.configService.get("REFRESH_TOKEN")
      
      
      const oauth2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
      oauth2client.setCredentials({refresh_token: REFRESH_TOKEN})
  
      // Getting connection to Google services 
      const drive = google.drive({
        version: 'v3',
        auth: oauth2client
      })
      
      // File saving on google drive method
      await drive.files.create({
        requestBody: {
          name: file.filename,
          mimeType: file.mimetype
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream("./upload/" + file.filename)
        }
      })
  
      console.log(`File - ${file.filename} successfully saved in Google Drive`);

    }
    catch(err){
      console.log(err.message);
    }
  }
}
