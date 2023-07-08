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