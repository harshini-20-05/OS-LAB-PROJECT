function callMyAlgorithm() {
    // Retrieve the values from the form fields
    var alg = document.getElementById("algorithm").value;
    let capacity = parseInt(document.getElementById("num_of_frames").value);
    let inp = document.getElementById("page_seq").value;
    var t = inp.split(" ").map(Number);
    let interval = parseInt(document.getElementById("interval").value);
    // Call myalgorithm function with the retrieved values
    if (alg == "sc") {
        sc(t, capacity);
    }
    else if (alg == "ensc") {
        Enhanced_Second_Chance(t, capacity);
    }
    else {
        rb(t, capacity, interval);
    }
}


// Function to implement LRU Approximation
function sc(t, capacity) {
    document.getElementById("ensc_button").hidden = "hidden";
    document.getElementById("modify_bits_sec").innerHTML = "";
    let n = t.length;
    let q = [];
    // Array to keep track of bits set when a
    // certain value is already in the queue    
    // Set bit --> true, if its a hit
    // find the index and set bitref[index] = true
    // Set bit --> false, if its a fault, and the front
    // of the queue has bitref[front] = true, send front
    // to back and set bitref[front] = false
    let bitref = Array(capacity).fill(false);

    // To find the first element that does not
    // have the bitref set to true
    let ptr = 0;

    // To check if the queue is filled up or not
    let count = 0;
    let hits = 0, faults = 0;
    let table = "<tr><th>Pages</th>";
        for (let i = 0; i < capacity; i++) {
            table += "<th>Frame " + i + "</th>";
        }
        table += "</tr>";
    for (let i = 0; i < n; i++) {
        if (!q.includes(t[i])) {
            table += "<tr class = table-danger>"
            table += "<td>" + t[i] + "</td>"
            // Queue is not filled up to capacity
            if (count < capacity) {
                q.push(t[i]);
                count++;
            } else {
                ptr = 0;

                // Find the first value that has its
                // bit set to false
                while (q.length > 0) {
                    // If the value has bit set to true
                    // Set it to false
                    if (bitref[ptr % capacity]) {
                        bitref[ptr % capacity] = !bitref[ptr % capacity];
                    } else {
                        break;
                    }
                    ptr++;
                }

                // If the queue was empty
                if (q.length == 0) {
                    q.shift();
                    q.push(t[i]);
                } else {
                    let j = 0;

                    // Rotate the queue and set the front's
                    // bit value to false until the value where
                    // the bitref = false
                    while (j < (ptr % capacity)) {
                        let t1 = q.shift();
                        q.push(t1);
                        let temp = bitref[0];

                        // Rotate the bitref array
                        for (let counter = 0; counter < capacity - 1; counter++) {
                            bitref[counter] = bitref[counter + 1];
                        }
                        bitref[capacity - 1] = temp;
                        j++;
                    }

                    // Remove front element
                    // (the element with the bitref = false)
                    q.shift();

                    // Push the element from the
                    // page array (next input)
                    q.push(t[i]);
                }
            }
            faults++;
        } else {
            table += "<tr class = 'table-success'>"
            table += "<td>" + t[i] + "</td>"
            let temp = q.slice();
            let counter = 0;
            while (q.length > 0) {
                if (q[0] == t[i]) {
                    bitref[counter] = true;
                }
                counter++;
                q.shift();
            }
            q = temp;
            hits++;
        }
        console.log(q);
        for (let i = 0; i < capacity; i++) {
            table += "<td>" + (q[i] !== undefined ? q[i] + " [" + +bitref[i] + "]" : "") + "</td>"
        }
        table += "</tr>";
    }
    console.log("Hits:", hits);
    console.log("Faults:", faults);

    table += "</tr>";
    document.getElementById("page_faults").innerHTML = "<strong>Total Page Faults: </strong>" + faults;
    document.getElementById("table").innerHTML = table;
}

function Enhanced_Second_Chance(t, capacity) {
    document.getElementById("page_faults").innerHTML = "";
    document.getElementById("table").innerHTML = "";
     // Create the table HTML string for the radios
     let modify_table = '<table class="table-primary table-hover" id="modify_bits">';
     for (let i = 0; i < capacity; i++) {
         modify_table += "<th>Frame " + i + "</th>";
     }
     modify_table += "</tr>";
     for (let i = 0; i < t.length; i++) {
         modify_table += "<tr>";
         for (let j = 0; j < capacity; j++) {
             modify_table += "<td><input type='radio' name='modify_bit_" + i + "_" + j + "'></td>";
         }
         modify_table += "</tr>";
     }
    modify_table += "</table>";
    document.getElementById("modify_bits_sec").innerHTML = modify_table;
    document.getElementById("ensc_button").hidden = "";
}

function do_ensc() {
    let capacity = parseInt(document.getElementById("num_of_frames").value);
    let inp = document.getElementById("page_seq").value;
    var t = inp.split(" ").map(Number);
    modify_bits = [];
    for (let i = 0; i < t.length; i++){
        modify_bits.push([]);
        for (let j = 0; j < capacity; j++) {
            radio = document.querySelector("input[name='" + "modify_bit_" + i + "_" + j + "']:checked")
            modify_bits[i].push(radio ? true: false);
        }
    }
    //document.getElementById("table").innerHTML = modify_bits;


    let q = [];
    let hits = 0;
    let faults = 0;
    let bitref = new Array(capacity).fill(false);
    let ptr = 0;
    let count = 0;

    let table = "<tr><th>Pages</th>";
        for (let i = 0; i < capacity; i++) {
            table += "<th>Frame " + i + "</th>";
        }
        table += "</tr>";
    for (let i = 0; i < t.length; i++) {
        console.log(bitref)
        if (!q.includes(t[i])) {
            table += "<tr class = table-danger>"
            table += "<td>" + t[i] + "</td>"
            if (count < capacity) {
                q.push(t[i]);
                count++;
            } else {
                ptr = 0;
                flag = false;
                for (let j = 0; j < capacity; j++) {
                    if (bitref[ptr]) {
                        bitref[ptr] = !bitref[ptr];
                    } else if (!modify_bits[i][ptr]) {
                        console.log(ptr)
                        flag = true
                        break;
                    }
                    ptr++;
                }
                if (!flag) {
                    flag2 = false;
                    ptr = 0;
                    for (let j = 0; j < capacity; j++) {
                        if (!modify_bits[i][ptr]) {
                            console.log(j)
                            flag2 = true;
                            break;
                        }
                        ptr++
                    }
                    if (!flag2) {
                        ptr = 0;
                    }
                }

                if (q.length === 0) {
                    q.shift();
                    q.push(t[i]);
                } else {
                    let j = 0;
                    while (j < (ptr % capacity)) {
                        let t1 = q.shift();
                        q.push(t1);
                        let temp = bitref[0];
                        for (let counter = 0; counter < capacity - 1; counter++) {
                            bitref[counter] = bitref[counter + 1];
                        }
                        bitref[capacity - 1] = temp;
                        j++;
                    }
                    q.shift();
                    q.push(t[i]);
                }
            }
            faults++;
        } else {
            table += "<tr class = 'table-success'>"
            table += "<td>" + t[i] + "</td>"
            let temp = q.slice();
            let counter = 0;
            while (q.length > 0) {
                if (q[0] === t[i]) {
                    bitref[counter] = true;
                }
                counter++;
                q.shift();
            }
            q = temp;
            hits++;
        }
        console.log(q);
        for (let j = 0; j < capacity; j++) {
            table += "<td>" + (q[j] !== undefined ? q[j] + " [" + +bitref[j] + ", " +  +modify_bits[i][j] + "]" : "") + "</td>";
        }
        table += "</tr>";
    }
    console.log("Hits:", hits);
    console.log("Faults:", faults);
    document.getElementById("page_faults").innerHTML = "<strong>Total Page Faults: </strong>" + faults;
    document.getElementById("table").innerHTML = table;
}

function rb(t, capacity, interval) {
    let q = [];
    let hits = 0;
    let faults = 0;
    let bitref = new Array(capacity).fill(0);
    let bytes = new Array(capacity).fill(0b00000000);
    let ptr = 0;
    let count = 0;

    document.getElementById("table").innerHTML = "<tr><th>Pages</th>";
    let table = "<tr><th>Pages</th>";
        for (let i = 0; i < capacity; i++) {
            table += "<th>Frame " + i + "</th>";
        }
        table += "</tr>";
    for (let i = 0; i < t.length; i++) {
        console.log(i);
        if (i % interval === 0) {
            for (let j = 0; j < capacity; j++) {
                bytes[j] = bytes[j] >> 1;
                bytes[j] += bitref[j] * 2 ** 7;
            }
            bitref = new Array(capacity).fill(0);
        }
        console.log(bitref);
        if (!q.includes(t[i])) {
            table += "<tr class = table-danger>"
            table += "<td>" + t[i] + "</td>"
            if (count < capacity) {
                q.push(t[i]);
                count++;
            } else {
                ptr = bytes.indexOf(Math.min(...bytes));

                if (!q.length) {
                    q.shift();
                    q.push(t[i]);
                } else {
                    let j = 0;
                    while (j < (ptr % capacity)) {
                        let t1 = q.shift();
                        q.push(t1);
                        let temp = bitref[0];
                        for (let counter = 0; counter < capacity - 1; counter++) {
                            bitref[counter] = bitref[counter + 1];
                        }
                        bitref[capacity - 1] = temp;
                        j++;
                    }
                    q.shift();
                    q.push(t[i]);
                }
                faults++;
            }
        } else {
            table += "<tr class = 'table-success'>"
            table += "<td>" + t[i] + "</td>"
            let temp = q.slice();
            let counter = 0;
            while (q.length > 0) {
                if (q[0] === t[i]) {
                    bitref[counter] = true;
                }
                counter++;
                q.shift();
            }
            q = temp;
            hits++;
        }
        for (let j = 0; j < capacity; j++) {
            table += "<td>" + (q[j] !== undefined ? q[j] + " [" + +bitref[j] + ", " +  bytes[j] + "]" : "") + "</td>";
        }
        console.log(q);
        console.log(bytes);
    }
    
    table += "</tr>";
    console.log("Hits:", hits);
    console.log("Faults:", faults);
    document.getElementById("page_faults").innerHTML = "<strong>Total Page Faults: </strong>" + faults;
    document.getElementById("table").innerHTML = table;
}
