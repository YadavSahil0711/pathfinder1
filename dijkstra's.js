function startDjikstra(s_node, e_node, n_map, diagonals){
    var dijkstra= {
        findPath:function(start,end,cols,rows,grid,diagonals)
        {
        var openList=[];
        openList.push(start);
        
        var node_loop = setInterval(function(){
            if(!isPaused){
                curr_process = node_loop;
                if(openList.length <= 0){
                    clearInterval(node_loop);
                    curr_process = null;
                }
                // Grab the lowest f(x) to process next(for dijkstra's f(x)=g(x) as h(x)=0)
                var lowInd=0;
                for(var i=0;i<openList.length;i++)
                {
                    if(grid[openList[i][0]][openList[i][1]][2]<grid[openList[lowInd][0]][openList[lowInd][1]][2])
                        {
                            lowInd=i;
                        }
                }
                var currentNode = openList[lowInd];
                if(!currentNode){
                    clearInterval(node_loop);
                    curr_process = null;
                }

                try {
                     // End case -- result has been found, return the traced path
                if (grid[currentNode[0]][currentNode[1]][3]=="Goal")
                {
                    var curr=currentNode;
                    var ret=[];
                    while(grid[curr[0]][curr[1]][4][0]!=-1&&grid[curr[0]][curr[1]][4][1]!=-1)
                        {
                            ret.push(curr);
                            curr=grid[curr[0]][curr[1]][4];
                        }
                    for(var i = 0; i < ret.length; i++) ret[i].reverse();
                    ret.reverse();
                    clearInterval(node_loop);
                    curr_process = null;
                    //return newLocation.path;
                    printPath(ret);
                    return ret;
                }
                // Normal case -- move currentNode from open to closed, process each of its neighbors
                openList.splice(lowInd,1);
                grid[currentNode[0]][currentNode[1]][5]=true;
                var neighbors=dijkstra.neighbors(grid,currentNode,rows,cols,diagonals);
                for(var i=0;i<neighbors.length;i++)
                    {
                        var neighbor=neighbors[i];
                        if(grid[neighbor[0]][neighbor[1]][5])
                            {
                                // not a valid node to process, skip to next neighbor
                                continue;
                            }
                        // g score is the shortest distance from start to current node, we need to check if
                        //   the path we have arrived at this neighbor is the shortest one we have seen yet
                    
                        var gscore=grid[currentNode[0]][currentNode[1]][0]+Math.sqrt((currentNode[0]-neighbor[0])*(currentNode[0]-neighbor[0])+(currentNode[1]-neighbor[1])*(currentNode[1]-neighbor[1]));    // 1 is the distance from a node                                                               to it's neighbor
                        var gscoreIsBest=false;
                        if(!grid[neighbor[0]][neighbor[1]][6])
                        {
                            // This the the first time we have arrived at this node, it must be the best
                            gscoreIsBest=true;
                            grid[neighbor[0]][neighbor[1]][6]=true;
                            if(grid[neighbor[0]][neighbor[1]][3]!="Goal"){
                                colorExploredPath(neighbor[1], neighbor[0]);
                                time_taken++;
                            }
                            openList.push(neighbor);
                        }
                        else if(gscore<grid[neighbor[0]][neighbor[1]][0])
                        {
                        // We have already seen the node, but last time it had a worse g (distance from start)
                            gscoreIsBest=true;
                        }
                        if(gscoreIsBest)
                        {
                            // Found an optimal (so far) path to this node.  Store info on how we got here and
                            //  just how good it really is...
                            grid[neighbor[0]][neighbor[1]][4]=currentNode;
                            grid[neighbor[0]][neighbor[1]][0]=gscore;
                            grid[neighbor[0]][neighbor[1]][2]=grid[neighbor[0]][neighbor[1]][0]+grid[neighbor[0]][neighbor[1]][1];
                        }
                }
                    
                } catch (error) {
                    clearInterval(node_loop);
                    curr_process = null;
                    printPostSearchData(0);
                }
               
                }
            }, 10);
            // No result was found -- empty array signifies failure to find path
            return [];
        },
        neighbors: function(grid,node,rows,cols,diagonals)
        {
            var ret=[];
            var x=node[0];
            var y=node[1];
           
            if(x-1>=0&&x-1<rows)
                {
                    if(grid[x-1][y][3]!="obstacle")
                        {
                            ret.push([x-1,y]);
                        }
                }
            if(x+1>=0&&x+1<rows)
                {
                    if(grid[x+1][y][3]!="obstacle")
                        {
                            ret.push([x+1,y]);
                        }
                }
            if(y-1>=0&&y-1<cols)
                {
                    if(grid[x][y-1][3]!="obstacle")
                        {
                            ret.push([x,y-1]);
                        }
                }
            if(y+1>=0&&y+1<cols)
                {
                    if(grid[x][y+1][3]!="obstacle")
                        {
                            ret.push([x,y+1]);
                        }
                }
            if(diagonals==true)
                {
                    if(x-1>=0&&x-1<rows&&y-1>=0&&y-1<cols)
                        {
                           
                            if(grid[x-1][y-1][3]!="obstacle"&&(grid[x][y-1][3]!="obstacle"||grid[x-1][y][3]!="obstacle"))
                                {
                                    ret.push([x-1,y-1]);
                                }
                        }
                    if(x-1>=0&&x-1<rows&&y+1>=0&&y+1<cols)
                        {
                           
                            if(grid[x-1][y+1][3]!="obstacle"&&(grid[x][y+1][3]!="obstacle"||grid[x-1][y][3]!="obstacle"))
                                {
                                    ret.push([x-1,y+1]);
                                }
                        }
                    if(x+1>=0&&x+1<rows&&y-1>=0&&y-1<cols)
                        {
                            if(grid[x+1][y-1][3]!="obstacle"&&(grid[x][y-1][3]!="obstacle"||grid[x+1][y][3]!="obstacle"))
                                {
                                    ret.push([x+1,y-1]);
                                }
                        }
                    if(x+1>=0&&x+1<rows&&y+1>=0&&y+1<cols)
                        {
                           
                            if(grid[x+1][y+1][3]!="obstacle"&&(grid[x][y+1][3]!="obstacle"||grid[x+1][y][3]!="obstacle"))
                                {
                                    ret.push([x+1,y+1]);
                                }
                        }
                }
            return ret;
        }
    }; 
    function dijkstraPathFinder(row_count,col_count,startCoordinates,goalCoordinates,obstacleList,diagonals)
    {
        var rows=row_count;
        var cols=col_count;     //manipulate them according to our grid inputs.
        var startX=startCoordinates[0];
        var startY=startCoordinates[1];
        var goalX=goalCoordinates[0];
        var goalY=goalCoordinates[1];
        var grid=[];
        for(var i=0;i<cols;i++)
            {
                grid[i]=[];
                for(var j=0;j<rows;j++)     //the format for each node is [g,h,f,empty/obstacle,parent,closed,visited]
                    {
                        grid[i][j]=[0,0,0,'empty',[-1,-1],false,false];
                    }
            }
        grid[startX][startY][3]="start";
        grid[goalX][goalY][3]="Goal";
        var obstacles=obstacleList;
        for(var i=0;i<obstacles.length;i++)
        {
            grid[obstacles[i][0]][obstacles[i][1]][3]="obstacle";
        }
        var finalpath=dijkstra.findPath([s_node[1], s_node[0]],[e_node[1], e_node[0]],rows,cols,grid,diagonals);
        return finalpath;
    }
    var row_grid = 36, col_grid = 64;
    var obstacles=[];
    for (var i=0; i<row_grid; i++) {
        for (var j=0; j<col_grid; j++) {
            if(n_map.has(i + "," + j)){
                obstacles.push([j, i]);
            }
        }
    }
    //invoking the pathFinding function
    var finalpath= dijkstraPathFinder(row_grid, col_grid, [s_node[1], s_node[0]], [e_node[1], e_node[0]],obstacles,diagonals);  //the last argument is for enabling diagonal search
    //printing the path
    for(var i=0;i<finalpath.length;i++)
    {
        console.log(finalpath[i][0]+" "+finalpath[i][1]+" ");
    }
}