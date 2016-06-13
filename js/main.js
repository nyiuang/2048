
var Container = React.createClass({   
    getInitialState: function() {
        return {
            numberList: [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
            ],
            newXY: [-1,-1]
        };
    },
    stateObj: {
        isOver: false
    },
    compareArr: function(arr1, arr2){
        var arr1Str = arr1.concat().toString();
        var arr2Str = arr2.concat().toString();
        return arr1Str==arr2Str;
    },
    reset: function(){
        var arr = [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
            ];
        var generateNewObj = this.generateNumber(arr);
        this.stateObj.isOver = false;
        this.setState({
            numberList: generateNewObj.numberList,
            newXY: generateNewObj.newXY
        });
    },
    setNumberList: function(arr){
        var generateNewObj = this.generateNumber(arr);
        this.setState({
            numberList: generateNewObj.numberList,
            newXY: generateNewObj.newXY
        });
    },
    generateNumber: function(arr){
        var number = Math.floor(Math.random() * 10) == 1 ? 4 : 2;
        var numberList = arr.concat();
        var randomArrs = [];
        var newNumberObj = {
            numberList: [],
            newXY: []
        };
        numberList.forEach(function(v, i){
            v.forEach(function(value, index){
                if(value == 0){
                    var randomItem = {
                        x_index: i,
                        y_index: index
                    }
                    randomArrs.push(randomItem);
                }
            });
        });
        if(randomArrs.length == 0){
            newNumberObj.numberList = numberList;
            newNumberObj.newXY = [-1,-1];
            return newNumberObj;
        }
        var randomIndex = Math.floor(Math.random() * randomArrs.length);
        var randomArr = randomArrs[randomIndex];
        numberList[randomArr.x_index][randomArr.y_index] = number;
        newNumberObj.numberList = numberList;
        newNumberObj.newXY = [randomArr.x_index,randomArr.y_index];
        return newNumberObj;
    },
    getMovedNumberList: function(arr){
        var self = this;
        var numberList = arr.concat();
        for(var i = 0; i < numberList.length; i++){
            var newColumnList = [];
            var columnList = numberList[i];
            var activeNumber = -1;
            columnList.forEach(function(v, i){
                if(v > 0){
                    if(v == activeNumber){
                        newColumnList[newColumnList.length-1] *= 2;
                        if(newColumnList[newColumnList.length-1] == self.props.maxNumber){
                            self.stateObj.isOver = true;
                        }
                        activeNumber = -1;
                    }
                    else{
                        newColumnList.push(v);
                        activeNumber = v;
                    }
                }
            });
            var extra = columnList.length - newColumnList.length;
            for(var j = 0; j < extra; j++){
                newColumnList.push(0);
            }
            numberList[i] = newColumnList;
        }
        return numberList;
    },
    getAntiNumberList: function(arr){
        var numberList = arr.concat();
        var row = numberList.length;
        var column = numberList[0].length;
        for(var i = 0; i < column; i++){
            for(var j = i+1; j < row; j++){
                var temp = numberList[i][j];
                numberList[i][j] = numberList[j][i];
                numberList[j][i] = temp;
            }
        }
        return numberList;
    },
    getInvertNumberList: function(arr){
        var numberList = arr.concat();
        for(var i = 0; i < numberList.length; i ++){
            var length = numberList[i].length;
            for(var j = 0; j < (length/2); j++){
                var temp = numberList[i][j];
                numberList[i][j] = numberList[i][length-j-1];
                numberList[i][length-j-1] = temp;
            }
        }
        return numberList;
    },
    getAntiInvertNumberList: function(arr){
        var numberList = arr.concat();
        var antiNumberList = this.getAntiNumberList(numberList);
        var antiInvertNumberList = this.getInvertNumberList(antiNumberList);
        return antiInvertNumberList;
    },
    handleClickUp: function(){
        var arr = this.state.numberList.concat();
        var antiNumberList = this.getAntiNumberList(arr);
        var movedNumberList = this.getMovedNumberList(antiNumberList);
        var newNumberList = this.getAntiNumberList(movedNumberList);
        this.setNumberList(newNumberList);
    },
    handleClickLeft: function(){
        var arr = this.state.numberList.concat();
        var movedNumberList = this.getMovedNumberList(arr);
        this.setNumberList(movedNumberList);
    },
    handleClickDown: function(){
        var arr = this.state.numberList.concat();
        var antiInvertNumberList = this.getAntiInvertNumberList(arr);  
        var movedNumberList = this.getMovedNumberList(antiInvertNumberList);
        var restoreNumberList = this.getInvertNumberList(movedNumberList);
        var newNumberList = this.getAntiNumberList(restoreNumberList);
        this.setNumberList(newNumberList);
    },
    handleClickRight: function(){
        var arr = this.state.numberList.concat();
        var invertNumberList = this.getInvertNumberList(arr);
        var movedNumberList = this.getMovedNumberList(invertNumberList);
        var newNumberList = this.getInvertNumberList(movedNumberList);
        this.setNumberList(newNumberList);
    },
    checkFail: function(){
        var arr = this.state.numberList.concat();
        /*if(this.checkLeft(arr) && this.checkRight(arr) && this.checkUp(arr) && this.checkDown(arr)){
            console.log('haha');
            return true;
        }*/
        var length = arr[0].length;
        var isFail = true;
        arr.forEach(function(v, i){
            v.forEach(function(value, j){
                var cp1 = -1,cp2 = -1,cp3 = -1,cp4 = -1;
                if(i > 0){
                    cp1 = arr[i-1][j];
                }
                if(i < length-1){
                    cp2 = arr[i+1][j];
                }
                if(j > 0){
                    cp3 = arr[i][j-1];
                }
                if(j < length-1){
                    cp4 = arr[i][j+1];
                }
                if(value == cp1 || value == cp2 || value == cp3 || value == cp4 || value == 0){
                    isFail = false;
                }
            });
        });
        return isFail;
    },
    checkLeft: function(arr){
        var tempArr = arr.concat();
        var movedNumberList = this.getMovedNumberList(tempArr);
        return this.compareArr(tempArr,movedNumberList);
    },
    checkRight: function(arr){
        var tempArr = arr.concat();
        var invertNumberList = this.getInvertNumberList(tempArr);
        var movedNumberList = this.getMovedNumberList(invertNumberList);
        var newNumberList = this.getInvertNumberList(movedNumberList);
        return this.compareArr(tempArr,newNumberList);
    },
    checkUp: function(arr){
        var tempArr = arr.concat();
        var antiNumberList = this.getAntiNumberList(tempArr);
        var movedNumberList = this.getMovedNumberList(antiNumberList);
        var newNumberList = this.getAntiNumberList(movedNumberList);
        return this.compareArr(tempArr,newNumberList);
    },
    checkDown: function(arr){
        var tempArr = arr.concat();
        var antiInvertNumberList = this.getAntiInvertNumberList(tempArr);  
        var movedNumberList = this.getMovedNumberList(antiInvertNumberList);
        var restoreNumberList = this.getInvertNumberList(movedNumberList);
        var newNumberList = this.getAntiNumberList(restoreNumberList);
        return this.compareArr(tempArr,newNumberList);
    },
    componentDidMount: function() {
        this.setNumberList(this.state.numberList);
        var self = this;
        document.onkeydown = function(event){
            var e = event || window.event;
            if(e.keyCode == 37){
                self.handleClickLeft();
            }
            if(e.keyCode == 38){
                self.handleClickUp();
            }
            if(e.keyCode == 39){
                self.handleClickRight();
            }
            if(e.keyCode == 40){
                self.handleClickDown();
            }
        }
    },
    componentDidUpdate: function(prevProps, prevState) {
        if(this.stateObj.isOver){
            alert("成功！");
            this.reset();
        }
        if(this.checkFail()){
            alert("失败！");
            this.reset();
        }
    },
	render: function() {
		return (
            <div onKeyPress={this.onKeyPress}>
    			<Box numberList={this.state.numberList} newXY={this.state.newXY} />
                <Ctrl handleClickUp={this.handleClickUp} handleClickLeft={this.handleClickLeft} handleClickDown={this.handleClickDown} handleClickRight={this.handleClickRight} />
            </div>
		);
	}
});

var Box = React.createClass({
    render: function(){
        var count = 0;
        var numberList = this.props.numberList;
        var newArr = [];
        for(var i = 0; i < numberList.length; i ++){
            for(var j = 0; j < numberList[i].length; j++){
                var number = numberList[i][j];
                var isNew = false;
                if(this.props.newXY[0] == i && this.props.newXY[1] == j){
                    isNew = true;
                }
                newArr.push({number: number, isNew: isNew});
            }
        }
        var items = newArr.map(function(v, i){
            if(v.isNew){
                return <Item key={i} isNumber="true" isNew="true" number={v.number} />;
            }
            else if(v.number > 0){
                return <Item key={i} isNumber="true" number={v.number} />;
            }
            else{
                return <Item key={i} />;
            }
        })
        return (
            <div className="box">
                {items}
            </div>
        );
    }
});

var Item = React.createClass({
    render: function(){
        var numberStyle = this.props.isNumber ? "number"+this.props.number : '';
        if(this.props.isNew){
            var number = this.props.number;
            var numberClass = "item number new " + numberStyle;
        }
        else if(this.props.isNumber){
            var number = this.props.number;
            var numberClass = "item number " + numberStyle;
        }
        else{
            var number = this.props.number;
            var numberClass = "item";
        }
        return (
            <div key={this.props.key} className={numberClass}>{number}</div>
        );
    }
});

var Ctrl = React.createClass({
    render: function(){
        return (
            <div className="ctrl">
                <button className="ctrl_btn" data-type="up" onClick={this.props.handleClickUp}>上</button>
                <button className="ctrl_btn" data-type="left" onClick={this.props.handleClickLeft}>左</button>
                <button className="ctrl_btn" data-type="down" onClick={this.props.handleClickDown}>下</button>
                <button className="ctrl_btn" data-type="right" onClick={this.props.handleClickRight}>右</button>
            </div>
        );
    }
});

React.render(
	<Container maxNumber="2048" />,
	document.getElementById('container')
);