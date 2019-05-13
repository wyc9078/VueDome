const express = require("express");
const app = express();
const conf = require("./config");
const request = require("request");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

app.use(express.static("img"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", "bmy");
  if (req.method == "OPTIONS") res.send(200);
  else next();
});

/**
 * 获取煎蛋网，段子内容
 * 访问地址：http://127.0.0.1:8080/index?page=70
 * 获取段子评论：http://jandan.net/tucao/3984420
 */
app.get("/index", function(req, res) {
  let URL = null, pageid = req.query.page;
  req.query.page >= 0 ? URL = `${conf.IndexUrl}/page-${pageid}` :  URL =  `${conf.IndexUrl}`
  console.log(URL)
  request(URL, function(error, response, body) {
    const $ = cheerio.load(body);
    let list = $(".commentlist li");
    let dzlist = [];
    list.each(function(index, ele) {
      dzlist.push({
        id: index + 1,
        posid: $(this).find(".text a").text(),
        author: $(this).find(".author strong").text(),
        photo: `${conf.domain}${index + 1}.jpg`,
        like: $(this).find(".tucao-like-container span").text(),
        unlike: $(this).find(".tucao-unlike-container span").text(),
        content: $(this).find(".text p").text()
      });
    });
    // 像前端输出json数据
    res.json({
      status: 200,
      maxPage: (($(".cp-pagenavi .current-comment-page").text()).replace(/[^0-9]/ig,"")).substring(0,2),
      datas: dzlist
    });
  });
});

/**
 * 获取对应段子的评论
 * 访问地址：http://127.0.0.1/tucao?postid=3986571
 */
app.get("/tucao", function(req, res) {
  let postid = req.query.postid;
  request(`${conf.TuCaoUrl}${postid}`, function(error, response, body) {
    res.json(JSON.parse(body));
  });
});

/**
 * 实现发布新的段子内容
 * 访问地址：http://127.0.0.1/comment
 */
app.post("/comment", function(req, res) {
  var formData = {
    author: req.body.author,
    email: req.body.email,
    comment: req.body.comment,
    comment_post_ID: "55592"
  };

  request.post(
    { url: `${conf.CommentUrl}`, formData: formData },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error("upload failed:", err);
      }
      res.json({
        status: "200",
        postid: body
      });
    }
  );
});


app.post("/SetPostcomment", function(req, res) {
  var formData = {
    author: req.body.author,
    email: req.body.email,
    content: req.body.comment,
    comment_id: req.body.postid
  };


  request.post(
    { url: `${conf.TuCaoComment}`, formData: formData },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error("upload failed:", err);
      }
      res.json({
        status: "200",
        postid: JSON.parse(body)
      });
    }
  );
});

/**
 * 实现对段子文章的点赞
 * 访问地址：http://127.0.0.1/like
 */
app.post("/like", function(req, res) {
  // 前端传过来的操作类型，like 表示喜欢，其他都是不喜欢
  let type = req.body.type
  var formData = {
    comment_id: req.body.postid,
    data_type: "comment"
  };
  
  if(type == "like"){
    formData.like_type = "pos"
  }else {
    formData.like_type = "neg"
  }

  request.post(
    { url: `${conf.LikeUrl}`, formData: formData },
    function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error("upload failed:", err);
      }
      res.json({
        status: "200",
        postid: body
      });
    }
  )
});


/**
 * 获取快手主播主页的视频数据
 */
app.get("/profile", function(req, res) {
  var userid = req.query.userid;

  request(`${conf.kuaiShou}${userid}`, function(error, response, body) {
      var data = body.match(/VUE_MODEL_INIT_STATE\[\'profileGallery\'\]=([\s\S]*?);/)[1]
      res.json(JSON.parse(data))
  })
});


/**
 * 获取图片
 * 访问地址：http://127.0.0.1:8080/picture
 */
app.get("/picture", function(req, res) {
  var headers = {
    url:`${conf.Picture}`,
    headers: {
      'Accept':'application/json',
      'Accept-Language':'zh-CN,zh;q=0.8',
      'Connection':'keep-alive',
      'Host':'huaban.com',
      'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0',
      'X-Request':'JSON',
      'X-Requested-With':'XMLHttpRequest'
    }
  };
  //let URL = null,
  //pageid = req.query.page;
  request.get(headers, function(error, response, body) {
    //向前端输出json数据;
    var info = JSON.parse(body);
    res.json(info);
    console.log(info)
  });
});



/**
 * 获取纯文鸡汤
 * http://127.0.0.1:8080/cwjt?page=1
 */
app.get("/cwjt", function(req, res) {
  var page = req.query.page;
  var pj1 = "/list_15_";
  var pj2 = ".html"
  var url = `${conf.chunwenjitang}${pj1}${page}${pj2}`
  request(url, function(error, response, body) {
      // console.log(body);
      const $ = cheerio.load(body)
      let list = $(".container .mLeft .post");
      let jtlist = [];
      //  console.log(list)
      for(var i=0;i<list.length-1;i++){
        var wz="http://www.59xihuan.cn"
        jtlist.push({
          bt : $(list[i]).find("a").text(),
          nr : $(list[i]).find(".pic_text1 p").text(),
          url : `${$(list[i]).find("a").attr("href")}`,
          img : `${wz}${$(list[i]).find(".pic_text1 img").attr("src")}`,
        })
      }
      res.json({
        cw: jtlist
      })
  })
});


  /**
 * 获取纯文鸡汤详情
 * http://127.0.0.1:8080/wzxq?url1=201809&url2=36291
 */
app.get("/wzxq", function(req, res) {
  var url1 = (req.query.url1).toString()
  var url2 = (req.query.url2).toString()
  var url3 = "/meiwen/"
  var url4 = ".html"
  var url5 = "/"
  var wz="http://www.59xihuan.cn"
  var wzwz=`${wz}${url3}${url1}${url5}${url2}${url4}`
    console.log(wzwz)
    request(wzwz, function(error, response, body) {
      const $ = cheerio.load(body)
      let list = $(".container .mLeft .post");
      let wzlist = [];
      for(var i=0;i<list.length-1;i++){
        wzlist.push({
          bt : $(list[i]).find(".mixed h4").text(),
          nr : $(list[i]).find(".mixed .pic_text0 p").text(),
        })
      }
      res.json({
          wzxq: wzlist
      })
    })
});
// app.get("/cwjt", function(req, res) {
//   request(conf.chunwenjitang, function(error, response, body) {
//       console.log(body);
//       const $ = cheerio.load(body)
//       let list = $(".container .mLeft .post");
//       let jtlist = [];
//        console.log(list)
//       for(var i=0;i<list.length-1;i++){
//         var wz="http://www.59xihuan.cn"
//         jtlist.push({
//           bt : $(list[i]).find("a").text(),
//           nr : $(list[i]).find(".pic_text1 p").text(),
//           img : `${wz}${$(list[i]).find(".pic_text1 img").attr("src")}`
//         })
//       }
//       res.json({
//         cw: jtlist
//       })
//   })




    //   var request = require('request');
 
    //   var options = {
    //     url: 'conf.chunwenjitang',
    //     headers: {
    //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36'
    //     }
    //   };
      
    //   function callback(error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //       var info = JSON.parse(body);
    //       console.log(body);
    //       const $ = cheerio.load(info);
    //       let list = $(".container .main .mLeft");
    //       let jtlist = [];
    //       console.log(list)
    //       for(var i=0;i<list.length;i++){
    //         jtlist.push({
    //           bt : $(list[i]).find(".post .detail1 a").text(),
    //         })
    //       }
    //       res.json({
    //         cw: jtlist
    //       })
    //   }
    // }
    // request(options, callback);
// })



app.listen(8080, function() {
  console.log("Example app listening on port 8080!");
});


