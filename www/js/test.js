function getDb() {
	// print("getDb() - start");
    return new PouchDB('tileDB', {adapter: 'idb'});
    // return new PouchDB('tileDB', {adapter: 'websql', size: 100});
}

function destroyDb() {
	print("destroyDb() - starting...");
	disableButtons();
	
    var db = getDb();
    db.destroy().then(function () {
        print("destroyDb() - success");
		enableButtons();
    }).catch(function (err) {
        print("destroyDb() - ERROR: " + err);
		enableButtons();
    });
}

function disableButtons() {
	document.getElementById('testButton').disabled = true;
	document.getElementById('destroyButton').disabled = true;
}

function enableButtons() {
	document.getElementById('testButton').disabled = false;
	document.getElementById('destroyButton').disabled = false;
}

function print(msg) {
	console.log(msg);
	var ele = document.getElementById('output');
	ele.innerHTML = msg+"<br/>"+ele.innerHTML;
}

function testDb() {
	// print("testDb() - start")
    var key = "KEY_" + performance.now();

    if (typeof window.testDbValue === 'undefined') {
		print("testDb() - start");
		disableButtons();
        window.testDbValue = "";
        window.testDbIteration = 0;
        for (var i = 0; i < 262144; i++) { // 256 kb
            window.testDbValue = window.testDbValue + "A";
        }
    }
    var value = window.testDbValue;

    var db = getDb();
    try {
        var tile = {_id: key, data: value};
        db.put(tile, function callback(err, result) {
            if (!err) {
                window.testDbIteration++;
                print('testDb(..) - Success; stored: ' + (window.testDbIteration / 4).toFixed(1) + " MB");
                testDb();
            } else {
                var reason = err.name + "_" + err.message + "_" + err.reason;
                print('testDb(..) - ERROR ( ' + err.status + " ) : " + JSON.stringify(err));
                delete window.testDbValue;
                delete window.testDbIteration;
				enableButtons();
            }
        });
    } catch (err) {
        print("testDb(..) - ERROR: " + err.message);
		enableButtons();
    }
}
