var http = require('http') ,
	sys = require('sys'),
   crawler = require('./crawler');

 var port = process.env.OPENSHIFT_NODEJS_PORT || 5858  
, ip = process.env.OPENSHIFT_NODEJS_IP || "172.30.253.207";

  var server = http.createServer(function (request, response) {
    var data = '';
  	var parts = request.url.split('/');
    
    
    
    if (parts[1]=='date'){
      var dt ={
        year:parts[2],
        month:parts[3],
        day:parts[4]
      }
      response.writeHead(200, { 'Content-Type': 'application/json' });
      //sys.puts(dt.year + ':' +parseInt(dt.month)+':'+parseInt(dt.day));
      crawler.CrawlerbyDate(dt,function(rtn){
        if (rtn.status=='false'){
          response.end(JSON.stringify({ message: rtn.msg }));   
        }
		      //response.end(JSON.stringify(rtn));
        var obj = crawler.ParseHtmlbyDate(dt,function(data){
          if (data.status==='false'){
            response.write(JSON.stringify(data));
          }
          if (data.length>0){
            response.write(JSON.stringify(data[0]));
            response.end();
            //sys.puts(data[0].ordernum[0]);
            //sys.puts(data[0].specialnum);  
          }else{
            response.end(JSON.stringify({ message: 'wrong date' }));        
          }
          
        });
        
      });  
    } else{
        response.end();
      } 
	  
  }).listen(port,ip);
//sys.puts( "Listening on " + ip + ", server_port " + port );
  //sys.puts('server running at port:5858');
  console.log( "Listening on " + ip + ", server_port " + port );
  console.log('server running at port:5858')