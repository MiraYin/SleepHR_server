import React from 'react';
import axios from 'axios';

function getAnglePoint(startAngle, endAngle, radius, x, y) {
	var x1, y1, x2, y2;
	x1 = x + radius * Math.cos(Math.PI * startAngle / 180);
	y1 = y + radius * Math.sin(Math.PI * startAngle / 180);
	x2 = x + radius * Math.cos(Math.PI * endAngle / 180);
	y2 = y + radius * Math.sin(Math.PI * endAngle / 180);
	return { x1, y1, x2, y2 };
}

class Slice extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			path: '',
			x: 0,
			y: 0
        };
        console.log(props);
		this.draw = this.draw.bind(this);
		this.animate = this.animate.bind(this);
	}

	componentDidMount(){
		this.animate();
	}

	draw(s){
		var p = this.props, path = [], a, b, c, self = this, step;
		step = p.angle / (37.5 / 2);
		if (s + step > p.angle) {
			s = p.angle;
		}

		// Get angle points
		a = getAnglePoint(p.startAngle, p.startAngle + s, p.radius, p.radius, p.radius);
		b = getAnglePoint(p.startAngle, p.startAngle + s, p.radius - p.hole, p.radius, p.radius);
		path.push('M' + a.x1 + ',' + a.y1);
		path.push('A'+ p.radius +','+ p.radius +' 0 '+ (s > 180 ? 1 : 0) +',1 '+ a.x2 + ',' + a.y2);
		path.push('L' + b.x2 + ',' + b.y2);
		path.push('A'+ (p.radius- p.hole) +','+ (p.radius- p.hole) +' 0 '+ (s > 180 ? 1 : 0) +',0 '+ b.x1 + ',' + b.y1);

		// Close
		path.push('Z');
		this.setState({ path: path.join(' ') });
		if (s < p.angle) {
			setTimeout(function () { self.draw(s + step) } , 16);
		} else {
			c = getAnglePoint(p.startAngle, p.startAngle + (p.angle / 2), (p.radius / 2 + p.trueHole / 2), p.radius, p.radius);
			this.setState({
				x: c.x2,
				y: c.y2
			});
		}
	}

	animate(){
		this.draw(0);
	}

	render(){
		return (
			<g overflow="hidden">
				<path
					d={ this.state.path }
					fill={ this.props.fill }
					stroke={ "#fff" }
					strokeWidth={3}
					 />
				{this.props.percentValue > 5 ?
					<text x={ this.state.x } y={ this.state.y } fill="#fff" textAnchor="middle">
					{ this.props.label + ': ' + this.props.percentValue + '%' }
					</text>
				: null }
			</g>
		);
	}
}


class Pie extends React.Component{
	render(){
		var colors = ['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C','#E2D1BA'],
			colorsLength = colors.length,
			hole = 50,
			radius = 150,
			diameter = radius * 2,
			self = this,
            startAngle, 
            d = null,
	    	sum = this.props.sum,
            startAngle = 0;

		return (
			<svg width={ diameter } height={ diameter } viewBox={ '0 0 ' + diameter + ' ' + diameter } xmlns="http://www.w3.org/2000/svg" version="1.1">
                { Object.entries(this.props.data).map((reason, index) => {
                    var angle, nextAngle, percent;
                    nextAngle = startAngle;
                    angle = (reason[1] / sum) * 360;
                    percent = (reason[1] / sum) * 100;
                    startAngle += angle;

                    return (<Slice 
                        key = {reason[0]}
                        label = {reason[0]}
                        value = {reason[1]}
                        percentValue={ percent.toFixed(1) }
                        startAngle={ nextAngle }
                        angle={ angle }
                        radius={ radius }
                        hole={ radius - hole }
                        trueHole={ hole }
                        fill={ colors[index] }
                    />);
                })}
			</svg>
		);
	}
}

class Legend extends React.Component{
    render(){
        var labels = this.props.labels,
            colors = this.props.colors;

        return(
            <div className="Legend">
			{ labels.map(function(label, labelIndex) {
				return (
				<div key={label}>
					<span className="Legend--color" style={{ backgroundColor: colors[labelIndex]  }} />
					<span className="Legend--label">{ label }</span>
				</div>
				);
			}) }
		    </div>
        );
    }
}

class Charts extends React.Component{
    render(){
        var self = this,
            data = this.props.data,
            min = Infinity,
            max = 0,
            colors = this.props.colors;
    
        for(let i = 0; i < data.length; i++){
            if(data[i].end > max){
                max = data[i].end;
            }
            if(data[i].start < min){
                min = data[i].start;
            }            
        }

        for(let i = 0; i < data.length; i++){
            data[i].start -= min;
            data[i].end -= min;
        }

        return (
            <div className='Charts horizontal'>
                <div className='Charts--serie'>
                    <label>Sleep Analysis</label>
                    {
                        data.map(function (item, itemIndex) {
                            console.log("item.end: " + item.end);
                            console.log("item.start: " + item.start);

                            var color = colors[item.sleepQuality], 
                                style,
                                duration = (item.end - item.start),
								size = duration / (max-min) * 100;
                            
							style = {
								backgroundColor: color,
								opacity: duration / (max-min) + .05,
								// zIndex: duration,
                            };
						
                            style['width'] = size + '%';
                            style['left'] = item.start/(max-min) * 100 + '%';
							
						 return (
                             // b: right label
							 <div
							 	className='Charts--item'
							 	style={ style }
								key={ itemIndex }
							    >
							 	<b style={{color: color }}>{'hello'}</b>
							 </div>
                        );
                    })
                }
                </div>
            </div>
        );
    }
}

class Report extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
        };
        this.compareBy = this.compareBy.bind(this);
        this.sortByKey = this.sortByKey.bind(this);
    }

    compareBy(key) {
        return function (a, b) {
          if (a[key] < b[key]) return  -1;
          if (a[key] > b[key]) return 1;
          return 0;
        };
    }
     
    sortByKey(key, array) {
        array.sort(this.compareBy(key));
    }

    componentDidMount(){
        axios.post("api/report", {_id: this.props.location.query._id}).then(res => {
            console.log(res);
            console.log(res.data);
            this.setState({
                data: res.data,
            });
        });
    }

    render(){
        var reasonData = {},
            reasonSum = 0,
            periodData = [],
            dataCopy = this.state.data,
            /// only plot past 14 days
            today = new Date(),
            range = this.props.location.query.analysisRange * 60 * 60 * 24 * 1000;

            console.log(range);

        for(let i = 0; i < dataCopy.length; i++){
            var wakedate = new Date(dataCopy[i].wakeDate), 
                sleepdate = new Date(dataCopy[i].sleepDate);///wakeDate = surveyDate, i.e. next morning
            console.log(wakedate);
            console.log(sleepdate);

            if(today.getTime() - wakedate.getTime() < range){
                console.log(today.getTime() - wakedate.getTime());
                /// within range
                if(dataCopy[i].stayUp){
                    reasonSum++;
                    reasonData[dataCopy[i].stayUpReason] ? reasonData[dataCopy[i].stayUpReason]++ : reasonData[dataCopy[i].stayUpReason] = 1;
                }
                
                ///bar chart: {start,end,quality,labels}
                if(sleepdate.getDate() != wakedate.getDate()){
                    periodData.push({
                        start: sleepdate.getHours() + sleepdate.getMinutes()/60 - 24,
                        end: wakedate.getHours() + wakedate.getMinutes() / 60,
                        date: wakedate,
                        sleepQuality: dataCopy[i].sleepQuality
                    });
                }else{
                    periodData.push({
                        start: sleepdate.getHours() + sleepdate.getMinutes()/60,
                        end: wakedate.getHours() + wakedate.getMinutes() / 60,
                        date: wakedate,
                        sleepQuality: dataCopy[i].sleepQuality
                    });
                }
            }
        }

        this.sortByKey('date',periodData);

        return(
            <div>
                <div>
                    <Pie data={reasonData} sum={reasonSum}/>
                </div>
                <div>
                    <Charts data={ periodData } colors={['#D3D3D3', '#A9A9A9', '#808080', '#696969', '#404040']}/>
                    <Legend labels={ [0, 1, 2, 3, 4].map(item => 'SleepQuality: '+item) } colors={['#D3D3D3', '#A9A9A9', '#808080', '#696969', '#404040']} />
                </div>
            </div>
        );
    }
}

/// provide _id and analysisRange
export default Report;
