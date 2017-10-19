import BaseAPI from './baseapi';

import _ from 'lodash';
import uuid from 'uuid';
import gm from 'gm';
import fs from 'fs';
import tesseract from 'node-tesseract';

export default class SddsAPI extends BaseAPI {
  fetchCaptcha(){
    let codePath = 'code_' + uuid() + '.jpg';
    return new Promise((resolve, reject)=>{
      let stream = gm(this.httpClient.get('http://wsbs.sdds.gov.cn/etax/captcha.jpg'))
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
    let ret = await this.httpPost('http://wsbs.sdds.gov.cn/etax/etax_login', {
      form: {
        lt:'${flowExecutionKey}',_eventId:'submit',method:'nsrUP',
        license:'',no:'',name:'',userType:'QY',wsaction:'',
        username,password,captcha_key:captcha
      }
    })
    return (ret.response.statusCode +':location:'+ret.response.headers['location']);
  }
}
