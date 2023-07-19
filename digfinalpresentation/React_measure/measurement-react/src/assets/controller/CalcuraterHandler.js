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
    const leanA = (pointData[3] - pointData[1]) / (pointData[2] - pointData[0]);
    const leanB = (pointData[5] - pointData[3]) / (pointData[4] - pointData[2]);
    const tangent = (leanB - leanA) / (1 + leanB * leanA);
    console.log(tangent);
    let angle = (Math.atan(tangent) * 180 / (Math.PI)).toFixed(2);
    if (angle === "NaN") angle = 90;
    return {
        dataLabel: "角度=",
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