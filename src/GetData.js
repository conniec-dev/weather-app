
async function GetData(url) {;
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    console.log("date: ", data.dt)
    return data
}

export {GetData};