import BaseAPI from './baseapi';

import _ from 'lodash';
import uuid from 'uuid';
import gm from 'gm';
import fs from 'fs';
import tesseract from 'node-tesseract';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';

export default class SdgsAPI extends BaseAPI {
  fetchCaptcha(){
    let codePath = 'code_' + uuid() + '.jpg';
    return new Promise((resolve, reject)=>{
      let stream = gm(this.httpClient.get('http://banshui.sd-n-tax.gov.cn:8080/enterprise/login/image.jsp'))
        .operator('gray', 'threshold', 50, true).stream();
      stream.pipe(fs.createWriteStream(codePath));
      stream.on('end', ()=>{
        tesseract.process(codePath, (error, text)=>{
          fs.unlink(codePath);
          error ? reject(error) : resolve(_.trim(text));
        });
      });
    });
  }

  async login(username, password){
    let captcha = await this.fetchCaptcha();
    while(captcha.length != 4){
      captcha = await this.fetchCaptcha();
      console.log(`captcha:${captcha}`);
    }
    let ret = await this.httpPost('http://banshui.sd-n-tax.gov.cn:8080/EnterpriseLoginAction.do', {
      form: {
        activity:'login',mmqd:'false',czydm:'',
        userId:username,password,verifyCode:captcha
      },encoding:null
    })

    let body = iconv.decode(ret.body,'GBK');

    let m = body.match(/<font(\s|\S)*font>/);


    //let $ = cheerio.load(iconv.decode(ret.body,'GBK'));

    return m ? m[0]:body;
  }
}
