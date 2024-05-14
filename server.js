const pg = require('pg');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db.js');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
    res.redirect("/booking");
});

app.get("/login", function (req, res) {
    var storedData = req.cookies.userId
    if (storedData) {
        res.redirect("/booking")
    }
    else {
        res.sendFile(path.join(__dirname, 'public', 'log.html'));
    }

})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
})


app.get("/booking", function (req, res) {
    var storedData = req.cookies.userId
    if (storedData) {
        res.sendFile(path.join(__dirname, 'public', 'booking.html'));
    }
    else {
        res.redirect("/login")
    }
})

app.post("/login/accounts", async function (req, res) {
    try {
        const { email, password } = req.body;
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT email, password, user_type FROM passenger", (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });

        const user = response.find(element => email === element.email && password === element.password);
        if (user) {
            res.cookie('userId', email);
            if (user.user_type === 'User') {
                res.status(200).send("u")
            }
            else if (user.user_type === 'Admin') {
                res.status(200).send("a")
            }
        }
        else {
            res.status(404).send('Not Found');
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get("/UI", async function (req, res) {
    var storedData = req.cookies.userId
    if (storedData) {
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT email, user_type FROM passenger", (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });

        const user = response.find(element => storedData === element.email && element.user_type === "Admin");
        if (user) {
            res.sendFile(path.join(__dirname, 'public', 'admin.html'));
        }
        else {
            res.sendFile(path.join(__dirname, 'public', 'ui.html'));

        }
    }

    else {
        res.redirect("/login")
    }

})


app.post("/register/accounts", async function (req, res) {
    try {
        let pid;
        db.query(`SELECT MAX(pid) AS max_pid FROM passenger`, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            pid = result.rows[0].max_pid + 1; // Assign the incremented pid
            let user_type = "User";
            const { name, email, password, phone, address } = req.body;
            db.query(`INSERT INTO passenger VALUES(${pid}, '${name}', '${phone}', '${email}', '${address}', '${user_type}', '${password}')`, (err, result) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.cookie('userId', email);
                res.status(200).send(email);
            });
        });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get("/logout", function (req, res) {
    res.clearCookie('userId');
    res.redirect("/login");
});
app.get("/forgetpassword", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'forgetPass.html'));
})
app.post("/forgetpassword", async function (req, res) {
    try {
        const { email, password } = req.body;
        if (email && password) {
            await new Promise((resolve, reject) => {
                db.query(`UPDATE passenger SET password = '${password}' WHERE email = '${email}'`, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }
                });
            });
            console.log("gg3")
            res.status(200).redirect('/login');
        } else {
            res.status(404);
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get("/payment", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
})

app.get("/thanks", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'thanks.html'));
})
app.post("/payment", async function (req, res) {
    try {
        const { credit_number, holder_name, end_date, cvv } = req.body;
        let email = req.cookies.userId;
        if (credit_number && end_date && cvv) {
            const pidResult = await db.query(`SELECT pid FROM passenger WHERE email= '${email}'`);
            const pid_c = pidResult.rows[0].pid;
            await new Promise((resolve, reject) => {
                db.query(`INSERT INTO payment_info (pid, end_date, cvv, credit_card)
                VALUES ('${pid_c}','${end_date}', '${cvv}', '${credit_number}');
                `, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }
                });
            });
            res.status(200).redirect('/thanks');
        } else {
            res.status(404);
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post("/addedTicket", async function (req, res) {
    try {
        let tid;
        let email = req.cookies.userId;
        let { booking_date,
            weight,
            purchase_date,
            pid,
            fid,
            seat_number,
            type } = req.body;

        if (pid == null) {
            const pidResult = await db.query(`SELECT pid FROM passenger WHERE email= '${email}'`);
            pid = pidResult.rows[0].pid;
        }

        db.query(`SELECT MAX(tid) AS max_tid FROM ticket`, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            tid = result.rows[0].max_tid + 1; // Assign the incremented pid
            if (booking_date && weight && pid && fid && seat_number) {
                new Promise((resolve, reject) => {
                    db.query(`INSERT INTO ticket 
                VALUES(${tid}, '${booking_date}', '${weight}',30,'${purchase_date}','${pid}', '${fid}', '${seat_number}','f', '${type}')`, (err, result) => {
                        if (err) {
                            console.log('Error executing query:', err);
                            reject(err);
                        } else {
                            resolve(result.rows);
                        }
                    });
                });
                res.status(200).send("ok")
            } else {
                res.status(404).send("not ok");
            }
        })
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/origin", async function (req, res) {
    const response = await new Promise((resolve, reject) => {
        db.query("SELECT src_city FROM flights where f_date >= CURRENT_DATE", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });

    res.json(response);
})

app.post("/dest", async function (req, res) {
    let { origin } = req.body
    if (origin) {
        const response = await new Promise((resolve, reject) => {
            db.query(`SELECT dest_city FROM flights WHERE src_city = '${origin}' and f_date >= CURRENT_DATE`, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });

        res.json(response);
    }
    else {
        res.send("none")
    }

})

app.post("/search", async function (req, res) {
    const { origin, dest, date } = req.body
    if (origin && dest) {
        if (date) {

        }
        const response = await new Promise((resolve, reject) => {
            query = `SELECT f.fid, f.src_city, f.f_date, f.f_time, f.dest_city, f.duration, air.economy_price FROM flights f join plane pl on f.plane_id=pl.plane_id join aircraft air on air.aircraft_type = pl.aircraft_type WHERE f.src_city = '${origin}' AND f.dest_city = '${dest}'`
            if (date) {
                query += "AND f.f_date = '${date}'"
            }
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });

        res.json(response);
    }
    else {
        res.send("none")
    }

})

app.post("/booking_seat", async (req, res) => {
    const { fid } = req.body;
    res.cookie('currentFlight', fid);
    res.status(200).send({ message: 'Booking successful' });
});
app.get("/booking_seat", async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'booking_seats.html'));
})


app.get('/booking_seat/info', async (req, res) => {
    fid = req.params.id;
    const response = await new Promise((resolve, reject) => {
        db.query("SELECT f.*, pl.total_seats, air.first_price, air.business_price, air.economy_price FROM flights f join plane pl on f.plane_id=pl.plane_id join aircraft air on air.aircraft_type = pl.aircraft_type WHERE f.src_city = '${origin}' AND f.dest_city = '${dest}'`", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });

    res.json(response);

})

app.get("/waitlist", async function (req, res) {
    const response = await new Promise((resolve, reject) => {
        db.query("SELECT p.name, w.position, w.fid, w.seat_type, w.pid FROM passenger p JOIN waitlist w ON p.pid = w.pid", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
    res.json(response);
})


app.post("/booking_info", async function (req, res) {
    const { fid } = req.body
    if (fid) {
        const response = await new Promise((resolve, reject) => {
            query = `SELECT f.fid, f.src_city, f.f_date, f.f_time, f.dest_city, f.duration, 
                        air.economy_price, air.business_price, air.first_price, air.first_seats, air.business_seats, air.economy_seats,
                        pl.total_seats
                        FROM flights f join plane pl on f.plane_id=pl.plane_id 
                        join aircraft air on air.aircraft_type = pl.aircraft_type 
                        WHERE f.fid='${fid}'`
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });

        res.json(response);
    }
    else {
        res.send("none")
    }

})


app.get("/activeFlights", async function (req, res) {
    const response = await new Promise((resolve, reject) => {
        db.query("SELECT fid,src_city,dest_city,f_time,f_date FROM flights", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
    res.json(response);
})
app.get("/cancelledTickets", async function (req, res) {
    const response = await new Promise((resolve, reject) => {
        db.query("SELECT * FROM ticket", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
    res.json(response);
})
app.get("/payments", async function (req, res) {
    const response2 = await new Promise((resolve, reject) => {
        db.query("SELECT ti.tid, ti.seat_type, ti.purchase_date, air.business_price, air.first_price, air.economy_price from ticket ti join flights fl on ti.fid = fl.fid join plane pl on pl.plane_id = fl.plane_id join aircraft air on pl.aircraft_type = air.aircraft_type where ti.cancelled = 'f'", (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
    let response = [];
    response2.forEach(element2 => {
        let price = null;


        if (element2.seat_type === 'Business') {
            price = element2.business_price;
        } else if (element2.seat_type === 'Economy') {
            price = element2.economy_price;
        } else {
            price = element2.first_price;
        }
        const resultObj = {
            tid: element2.tid,
            purchase_date: element2.purchase_date,
            price: price
        };

        response.push(resultObj);
    });
    res.json(response);
})

app.post("/allTicketsID", async function (req, res) {
    const { tid } = req.body;
    if (tid) {
        try {
            const response = await new Promise((resolve, reject) => {
                db.query(`SELECT tid from ticket where tid = ${tid}`, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }

                });
            });

            if (response.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query(`DELETE FROM ticket WHERE tid = ${tid}`, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result.rows);
                        }
                    });
                });




                res.status(200).send("Ticket successfully deleted!");
            }
            else {
                console.error("Error deleting ticket:", error);
                res.status(500).send("Internal Server Error");
            }
        }

        catch (error) {
            console.error("Error deleting ticket:", error);
            res.status(500).send("Internal Server Error");
        }


    }

    else {
        // Handle case where 'tid' is missing in the request body
        res.status(400).send("Ticket ID (tid) is required");
    }

})
app.post("/allTicketsIdEdit", async function (req, res) {
    const { tid, seat_number } = req.body;
    if (tid) {
        try {
            const response = await new Promise((resolve, reject) => {
                db.query(`SELECT tid from ticket where tid = ${tid}`, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }

                });
            });

            if (response.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query(`UPDATE ticket set seat_number='${seat_number}' WHERE tid = ${tid}`, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result.rows);
                        }
                    });
                });




                res.status(200).send("Ticket successfully deleted!");
            }
            else {
                console.error("Error deleting ticket:", error);
                res.status(500).send("Internal Server Error");
            }
        }

        catch (error) {
            console.error("Error deleting ticket:", error);
            res.status(500).send("Internal Server Error");
        }


    }

    else {
        res.status(400).send("Ticket ID (tid) is required");
    }

})
app.post('/tickets', async (req, res) => {
    const { fid } = req.body
    const response2 = await new Promise((resolve, reject) => {
        db.query(`SELECT seat_number from ticket where fid='${fid}' and cancelled = 'f'`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
    res.json(response2);
})

app.get('/user', async (req, res) => {
    let email = req.cookies.userId;

    response = await await new Promise((resolve, reject) => {
        db.query(`SELECT name from passenger where email='${email}'`, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.rows);
            }

        });

    });
    res.json(response);
})
app.get('/bookingPercentage', async (req, res) => {
    response = await await new Promise((resolve, reject) => {
        db.query("SELECT f.fid,ROUND((COUNT(t.tid) * 100.0 / p.total_seats), 2) AS booking_percentage,f.f_date FROM flights f LEFT JOIN ticket t ON f.fid = t.fid LEFT JOIN plane p ON f.plane_id = p.plane_id GROUP BY f.fid, p.total_seats", (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.rows);
            }

        });

    });
    res.json(response);
})

app.post('/cancelTicket', async (req, res) => { })

app.post('/editTicket', async (req, res) => { })

app.post('/promote', async (req, res) => {
    const { pid, fid, seat_number, type } = req.body
    const dateTime2 = new Date();
    const year2 = dateTime2.getFullYear();
    const month2 = dateTime2.getMonth() + 1;
    const day2 = dateTime2.getDate();
    const formattedDate2 = `${year2}-${month2.toString().padStart(2, '0')}-${day2.toString().padStart(2, '0')}`;

    await fetch('http://localhost:3000/addedTicket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            booking_date: formattedDate2,
            weight: "50",
            purchase_date: formattedDate2,
            pid: pid,
            fid: fid,
            seat_number: seat_number,
            type: type
        })
    }).then(response => {
        if (!response.ok) {
            console.log("Error")
            throw new Error("")
        }
        return response.text();
    }).then(data => {
        console.log(data);

    }).catch(error => {
        alert(error.message);
    });

    await db.query(`DELETE FROM waitlist WHERE pid = '${pid}'`)

})

// promote a wait lister to any available seat.

app.post('/availableSeats', async (req, res) => {
    const { fid } = req.body
    const reservedSeats = await new Promise((resolve, reject) => {
        db.query(`SELECT ti.seat_number, pl.total_seats, air.economy_seats, air.business_seats, air.first_seats
                from ticket ti join flights fl on ti.fid = fl.fid 
                join plane pl on fl.plane_id = pl.plane_id
                join aircraft air on pl.aircraft_type = air.aircraft_type
                where ti.fid='${fid}' and cancelled = 'f'`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });


    const allSeatsT = await new Promise((resolve, reject) => {
        db.query(`SELECT pl.total_seats, air.economy_seats, air.first_seats, air.business_seats
                from flights fl
                join plane pl on fl.plane_id = pl.plane_id
                join aircraft air on pl.aircraft_type = air.aircraft_type
                where fl.fid='${fid}'`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });

    totalSeats = allSeatsT[0]["total_seats"]
    eco = allSeatsT[0]["economy_seats"]
    bus = allSeatsT[0]["business_seats"]
    first = allSeatsT[0]["first_seats"]


    console.log(totalSeats);
    allSeats = {}
    for (let i = 1; i <= Math.floor(totalSeats / 6); i++) {
        if (i <= Math.floor(eco / 6)) {
            allSeats[`${i}A`] = 'Economy'
            allSeats[`${i}B`] = 'Economy'
            allSeats[`${i}C`] = 'Economy'
            allSeats[`${i}D`] = 'Economy'
            allSeats[`${i}E`] = 'Economy'
            allSeats[`${i}F`] = 'Economy'

        }
        else if (i <= Math.floor((eco + bus) / 6)) {
            allSeats[`${i}A`] = 'Business'
            allSeats[`${i}B`] = 'Business'
            allSeats[`${i}C`] = 'Business'
            allSeats[`${i}D`] = 'Business'
            allSeats[`${i}E`] = 'Business'
            allSeats[`${i}F`] = 'Business'
        }
        else if (i <= Math.floor((eco + bus + first) / 6)) {
            allSeats[`${i}A`] = 'First'
            allSeats[`${i}B`] = 'First'
            allSeats[`${i}C`] = 'First'
            allSeats[`${i}D`] = 'First'
            allSeats[`${i}E`] = 'First'
            allSeats[`${i}F`] = 'First'
        }
    }

    if (reservedSeats.length > 0) {
        let eco = reservedSeats[0].economy_seats;
        let bus = reservedSeats[0].business_seats;
        let first = reservedSeats[0].first_seats;

        for (i = 0; i < reservedSeats.length; i++) {
            if (allSeats[reservedSeats[i].seat_number] !== undefined) {
                delete allSeats[reservedSeats[i].seat_number]
            }
        }
    }
    console.log(allSeats)
    res.json(allSeats);
})

app.get('/userTickets', async (req, res) => {
    let email = req.cookies.userId
    const tickets = await new Promise((resolve, reject) => {
        db.query(`SELECT ti.tid, ti.seat_number, ti.seat_type from ticket ti join passenger pa on pa.pid=ti.pid where pa.email='${email}' and ti.cancelled='f'`
            , (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
    });

    res.json(tickets)

})
app.post("/cancelUserTicket", async function (req, res) {
    const { tid } = req.body;
    if (tid) {
        try {
            const response = await new Promise((resolve, reject) => {
                db.query(`SELECT tid from ticket where tid = ${tid}`, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }

                });
            });

            if (response.length > 0) {
                await new Promise((resolve, reject) => {
                    db.query(`UPDATE ticket set cancelled='true' WHERE tid = ${tid}`, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result.rows);
                        }
                    });
                });




                res.status(200).send("Ticket successfully cancelled!");
            }
            else {
                console.error("Error cancelling ticket:", error);
                res.status(500).send("Internal Server Error");
            }
        }

        catch (error) {
            console.error("Error cancelling ticket:", error);
            res.status(500).send("Internal Server Error");
        }


    }

    else {
        res.status(400).send("Ticket ID (tid) is required");
    }

})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

