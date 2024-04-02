export function csvToArray(csv) {
    let rows = csv.replaceAll('\r', "").split("\n");
    rows = rows.filter((i) => i != "")
    rows = rows.map(function (row) {
        return row.split(",");
    });
    return rows
};

export function transpose(matrix) {
    //[[1,2,3],[4,5,6]] to [[1,4],[2,5],[3,6]]
    return matrix.reduce((prev, next) => next.map((item, i) =>
        (prev[i] || []).concat(next[i])
    ), []);
}

export function convertArray(array) {
    return array.map((i) => i.map((i) => parseInt(i)))
}

export function jsonToArray(text) {
    return JSON.parse(text, (key, value) => {
        // if (key == "date") {
        //     return value.map(i => new Date(i))
        // }
        if (value == "NaN") {
            return null
        } else {
            return value;
        }
    })
}
