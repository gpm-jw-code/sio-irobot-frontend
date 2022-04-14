class Options {
    constructor(type) {
        this.chart.type = type
    }

    dataLabels = {
        enabled: false,
    };
    chart = {
        type: "area",
        height: 300,
        animations: {
            enabled: false,
            animateGradually: {
                enabled: false,
            },
            dynamicAnimation: {
                enabled: false,
            },
        },
        background: 'rgb(51,51,51)',
        foreColor: '#fff'
    };
    title = {
        text: 'Apex Chart Demo',
        align: 'left',
        style: {
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: '#fff'
        },
    };
    xaxis = {
        categories: [],
        title: {
            text: ""
        },
        /**X軸Tick顯示的點數(label數量) */
        tickAmount: 5
    };
    yaxis = {
        labels: {
            formatter: (value) => {
                return value.toFixed(2);
            },
        }, title: {
            text: ""
        }
    };

    stroke = {
        show: true,
        curve: 'straight',
        lineCap: 'square',
        colors: undefined,
        width: 2,
        dashArray: 0,
    }
}

class Series {
    constructor(seriesName, dataPoints) {
        this.name = seriesName;
        this.data = dataPoints;
    }

    name = "series";
    data = [];

    Append(dataPoint) {
        this.data.push(dataPoint);
        if (this.data.length > 40) {
            this.data = this.data.slice(1, 41)
        }
    }

    GenFakeData(interval) {
        setInterval(() => {
            var random = Math.random();
            this.Append(random);
        }, interval);
    }
}


export { Options, Series }
