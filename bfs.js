function startBFSSearch(s_node, e_node, n_map, diagonals){
  var Bfs={
    findPath:function(startCoordinates,endCoordinates,cols,rows,grid,diagonals)
      {
          var queue=[];
          queue.push(startCoordinates);
          
          var node_loop = setInterval(function(){
            if(!isPaused){
                curr_process = node_loop;
                if(queue.length <= 0){
                    clearInterval(node_loop);
                    curr_process = null;
                }
                  var currentLocation=queue.shift();
                  try {
                    if(currentLocation[0]==endCoordinates[0]&&currentLocation[1]==endCoordinates[1])
                    {
                        var path=currentLocation;
                        var ret=[];
                        while(grid[path[0]][path[1]][1][0]!=-1&&grid[path[0]][path[1]][1][1]!=-1)
                        {
                            ret.push(path);
                            path=grid[path[0]][path[1]][1];
                        }
                        for(var i = 0; i < ret.length; i++) ret[i].reverse();
                        ret.reverse();
                        clearInterval(node_loop);
                        curr_process = null;
                        printPath(ret);
                        return ret;
                    }
                    grid[currentLocation[0]][currentLocation[1]][0]='visited';
                    var neighbors=Bfs.getNeighbors(grid,currentLocation,rows,cols,diagonals);
                    for(neighbor of neighbors)
                        {
                            if(grid[neighbor[0]][neighbor[1]][0]!='visited')
                                {
                                    queue.push(neighbor);
                                    grid[neighbor[0]][neighbor[1]][1]=currentLocation;
                                    if(grid[neighbor[0]][neighbor[1]][0]!="Goal"){
                                        colorExploredPath(neighbor[1], neighbor[0]);
                                        time_taken++;
                                    }
                                }
                            grid[neighbor[0]][neighbor[1]][0]='visited'
                        }
                  } catch (error) {
                    clearInterval(node_loop);
                    curr_process = null;
                    printPostSearchData(0);
                  }
                  
                    }
              },10);
          return [];
      },
      getNeighbors: function(grid,node,rows,cols,diagonals)
      {
          var ret=[];
          var x=node[0];
          var y=node[1];
          
          if(x-1>=0&&x-1<rows)
              {
                  if(grid[x-1][y][0]!="obstacle")
                      {
                          ret.push([x-1,y]);
                      }
              }
          if(x+1>=0&&x+1<rows)
              {
                  if(grid[x+1][y][0]!="obstacle")
                      {
                          ret.push([x+1,y]);
                      }
              }
          if(y-1>=0&&y-1<cols)
              {
                  if(grid[x][y-1][0]!="obstacle")
                      {
                          ret.push([x,y-1]);
                      }
              }
          if(y+1>=0&&y+1<cols)
              {
                  if(grid[x][y+1][0]!="obstacle")
                      {
                          ret.push([x,y+1]);
                      }
              }
          if(diagonals==true)
              {
                  if(x-1>=0&&x-1<rows&&y-1>=0&&y-1<cols)
                      {
                          
                          if(grid[x-1][y-1][0]!="obstacle"&&(grid[x][y-1][0]!="obstacle"||grid[x-1][y][0]!="obstacle"))
                              {
                                  ret.push([x-1,y-1]);
                              }
                      }
                  if(x-1>=0&&x-1<rows&&y+1>=0&&y+1<cols)
                      {
                          
                          if(grid[x-1][y+1][0]!="obstacle"&&(grid[x][y+1][0]!="obstacle"||grid[x-1][y][0]!="obstacle"))
                              {
                                  ret.push([x-1,y+1]);
                              }
                      }
                  if(x+1>=0&&x+1<rows&&y-1>=0&&y-1<cols)
                      {
                          if(grid[x+1][y-1][0]!="obstacle"&&(grid[x][y-1][0]!="obstacle"||grid[x+1][y][0]!="obstacle"))
                              {
                                  ret.push([x+1,y-1]);
                              }
                      }
                  if(x+1>=0&&x+1<rows&&y+1>=0&&y+1<cols)
                      {
                          
                          if(grid[x+1][y+1][0]!="obstacle"&&(grid[x][y+1][0]!="obstacle"||grid[x+1][y][0]!="obstacle"))
                              {
                                  ret.push([x+1,y+1]);
                              }
                      }
              }
          return ret;
      }
  };
  function BfsPathFinder(row_count,col_count,startCoordinates,goalCoordinates,obstacleList,diagonals)
  {
      var rows=row_count;
      var cols=col_count;
      var startX=startCoordinates[0];
      var startY=startCoordinates[1];
      var goalX=goalCoordinates[0];
      var goalY=goalCoordinates[1];
      
      var grid=[];
      for(var i=0;i<cols;i++)
      {
          grid[i]=[];
          for(var j=0;j<rows;j++)
          {
              grid[i][j]=['empty',[-1,-1]];
          }
      }
      grid[startX][startY][0]="start";
      grid[goalX][goalY][0]="Goal";
      var obstacles=obstacleList;
      for(var i=0;i<obstacles.length;i++)
          {
              grid[obstacles[i][0]][obstacles[i][1]][0]="obstacle";
          }
      
      var finalpath=Bfs.findPath([startX,startY],[goalX,goalY],rows,cols,grid,diagonals);
      return finalpath;
  };

  var row_grid = 36, col_grid = 64;
  var obstacles=[];
  for (var i=0; i<row_grid; i++) {
      for (var j=0; j<col_grid; j++) {
          if(n_map.has(i + "," + j)){
              obstacles.push([j, i]);
          }
      }
  }
  var finalpath= BfsPathFinder(row_grid, col_grid, [s_node[1], s_node[0]], [e_node[1], e_node[0]],obstacles,diagonals);
  //printing the path
  for(var i=0;i<finalpath.length;i++)
  {
      console.log(finalpath[i][0]+" "+finalpath[i][1]+" ");
  }
}