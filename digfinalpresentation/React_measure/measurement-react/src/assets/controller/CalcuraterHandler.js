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
        moveFlg: false,
        measurePosition: measureCordinate,
    })
}

export const combineData = (dataContent) => {
    const pointPosi = [];
    const labelPosi = [];
    for (const elm of dataContent) {
        pointPosi.push(...elm.lengthData);
        labelPosi.push(...elm.measureLabel.measurePosition)
    }
    return [pointPosi, labelPosi];
}