import { Controller, HttpStatus, Post, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { diskStorage } from 'multer'
import { extname } from 'path';
import {File} from './interfaces/file.interface'


@Controller()
export class AppController {
  constructor( private readonly appService: AppService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: './upload', filename: (req, file, cb) => {
    const date = new Date();
    const name = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getMilliseconds();
    cb(null, name + extname(file.originalname));
  } }) }))
  async uploadSingle(@UploadedFile() file: File, @Res() response){

    console.log(`File - ${file.filename} successfully saved!`);

    this.appService.uploadFile(file);
    return response.status(HttpStatus.OK).json();

  }  
}
