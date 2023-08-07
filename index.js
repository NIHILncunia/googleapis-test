const fs = require('fs');
const http = require('http');
const readline = require('readline');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const service = google.youtube('v3');

const clientId = '718068923695-areq6bk2cvp10fgj436ed5aeqd951nf9.apps.googleusercontent.com';
const clientSecret = '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';
const redirectUrl = 'http://localhost:5500/auth.html';

const oAuth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

async function authenticate() {
  return new Promise((resolve, reject) => {
    if () {

    } else {
      
    }
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtubepartner-channel-audit'
      ],
    });

    const server = http.createServer(async (req, res) => {
      try {
        if (req.url.indexOf('/auth') > -1) {
          const qs = new url.URL(req.url, 'http://localhost:5500').searchParams;
          server.destroy();

          const { tokens } = await oAuth2Client.getToken(qs.get('code'));
          oAuth2Client.credentials = tokens;

          resolve(oAuth2Client);
        }
      } catch (error) {
        reject(e);
      }
    }).listen(3000, () => {
      open(authorizeUrl, {
        wait: false,
      }).then((cp) => cp.unref());
    });

    destroy(server);
  });
}

async function uploadVideo(auth, name) {
  const fileSize = fs.statSync(name).size;
  const res = await service.videos.insert({
    auth,
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title: '유튜브 영상 테스트를 위한 연습',
        description: '아이브 조아',
        tags: ['유튜브API', '동영상업로드', 'videos.insert'],
      },
      status: {
        privacyStatus: 'private',
      },
    },
    media: {
      body: fs.createReadStream(name),
    }
  }, {
    onUploadProgress: evt => {
      const progress = (evt.bytesRead / fileSize) * 100;
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0, null);
      process.stdout.write(`${Math.round(progress)}% 완료`);
    },
  });

  console.log('\n\n');
  return res.data;
}

authenticate()
  .then((client) => uploadVideo(client, 'C:\\Users\\nihil\\Downloads\\Video\\20230423.mp4'))
  .catch(console.error);