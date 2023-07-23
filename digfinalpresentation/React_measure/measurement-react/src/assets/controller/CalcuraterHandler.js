import { Category } from "@mui/icons-material";




export const handleCanvasClick = (e) => {
    const revice = e.target.getBoundingClientRect();
    const x = e.clientX - revice.left;
    const y = e.clientY - revice.top;
    return [x, y];
}

export const calculateLean = (arg) => {
    const direction = arg[0];
    const baseLength = arg[1];
    const cordinate = arg.splice(2, 4);
    let leanResult = 0;

    switch (direction) {
        case "x":
            const tempXLength = cordinate[2] - cordinate[0];
            leanResult = baseLength / tempXLength;
            break;
        case "y":
            const tempYLength = cordinate[3] - cordinate[1];
            leanResult = baseLength / tempYLength;
            break;
        case "Length":
            const tempLength = ((cordinate[2] - cordinate[0]) ** 2 + (cordinate[3] - cordinate[1]) ** 2) ** (1 / 2)
            leanResult = baseLength / tempLength;
            break;
        default:
            break;
    }
    return leanResult;
}

export const calculateLength = (lean, pointData) => {
    const diffX = pointData[2] - pointData[0];
    const diffY = pointData[3] - pointData[1];
    const xResult = (diffX * lean).toFixed(2);
    const yResult = (diffY * lean).toFixed(2);
    const lengthResult = ((diffX ** 2 + diffY ** 2) ** (1 / 2) * lean).toFixed(2);
    const result = [
        {
            showFlg: true,
            dataLabel: "X=",
            data: xResult,
        },
        {
            showFlg: true,
            dataLabel: "Y=",
            data: yResult,
        },
        {
            showFlg: true,
            dataLabel: "直線=",
            data: lengthResult,
        },

    ]
    return result;
}

export const calculateMeasureLabel = (pointData) => {
    const xAverage = (pointData[2] + pointData[0]) / 2;
    const yAverage = (pointData[3] + pointData[1]) / 2;
    const measureCordinate = [xAverage, yAverage, xAverage + 100, yAverage + 100];
    return ({
        operateIcon: false,
        moveFlg: false,
        measurePosition: measureCordinate,
    })
}

export const calculateAngle = (pointData) => {
    let leanA = 0;
    if (pointData[3] - pointData[1] === 0) {
        leanA = 0;
    } else if (pointData[2] - pointData[0] === 0) {
        leanA = "NaN";
    } else {
        leanA = (pointData[3] - pointData[1]) / (pointData[2] - pointData[0]);
    }
    let leanB = 0;
    if (pointData[5] - pointData[3] === 0) {
        leanB = 0;
    } else if (pointData[4] - pointData[2] === 0) {
        leanB = "NaN";
    } else {
        leanB = (pointData[5] - pointData[3]) / (pointData[4] - pointData[2]);
    }
    let angleA = 0;
    if (leanA === 0) {
        if (pointData[2] < pointData[0]) {
            angleA = 0;
        } else {
            angleA = 180;
        }
    } else if (leanA === "NaN") {
        if (pointData[3] > pointData[1]) {
            angleA = 90;
        } else {
            angleA = 270;
        }
    } else if (leanA < 0) {
        angleA = (pointData[2] - pointData[0]) < 0 ? Math.abs(Math.atan(leanA) * 180 / (Math.PI)) : Math.abs(Math.atan(leanA) * 180 / (Math.PI)) + 180;
    } else {
        angleA = (pointData[2] - pointData[0]) > 0 ? 180 - Math.abs(Math.atan(leanA) * 180 / (Math.PI)) : 360 - Math.abs(Math.atan(leanA) * 180 / (Math.PI));
    }
    let angleB = 0;
    if (leanB === 0) {
        if (pointData[4] > pointData[2]) {
            angleB = 0;
        } else {
            angleB = 180;
        }
    } else if (leanB === "NaN") {
        if (pointData[5] < pointData[3]) {
            angleB = 90;
        } else {
            angleB = 270;
        }
    } else if (leanB < 0) {
        angleB = (pointData[4] - pointData[2]) > 0 ? Math.abs(Math.atan(leanB) * 180 / (Math.PI)) : Math.abs(Math.atan(leanB) * 180 / (Math.PI)) + 180;
    } else {
        angleB = (pointData[4] - pointData[2]) < 0 ? 180 - Math.abs(Math.atan(leanB) * 180 / (Math.PI)) : 360 - Math.abs(Math.atan(leanB) * 180 / (Math.PI));
    }
    let angle = Math.abs(angleB - angleA).toFixed(2);
    angle > 180 ? angle = 360 - angle : angle = angle;

    return {
        dataLabel: "Θ=",
        data: angle,
    }
}

export const calculateAngleLabel = (pointData) => {
    const cordinate = [pointData[2], pointData[3], pointData[2] + 100, pointData[3] + 100];
    return ({
        operateIcon: false,
        moveFlg: false,
        measurePosition: cordinate,
    })
}


export const combineData = (dataContent) => {
    const pointPosi = [];
    const labelPosi = [];
    const anglePointPosi = [];
    const angleLabelPosi = [];
    for (const elm of dataContent) {
        if (elm.category === "length") {
            pointPosi.push(...elm.lengthData);
            labelPosi.push(...elm.measureLabel.measurePosition);
        } else if (elm.category === "angle") {
            anglePointPosi.push(...elm.lengthData);
            angleLabelPosi.push(...elm.measureLabel.measurePosition);
        }
    }
    return [pointPosi, labelPosi, anglePointPosi, angleLabelPosi];
}