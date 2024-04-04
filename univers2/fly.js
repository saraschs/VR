    let gauche = {
        pos: {
            x: 0,
            y: 0,
            z: 0
        }
    }
    let droite = {
        pos: {
            x: 0,
            y: 0,
            z: 0
        }
    }
    let info = true;

    // POSITION MANETTE (relative par rapport à la caméra)
    AFRAME.registerComponent('handposition', {
        schema: {
            trace: {
                type: 'boolean',
                default: false
            },
        },
        tick: function () {
            var handpos = this.el.object3D.position;
            var id = this.el.id;
            if (id == "lefthand") gauche.pos = handpos;
            if (id == "righthand") droite.pos = handpos;

            if (this.data.trace) {
                var trace = document.querySelector('#txtlog');
                var newvalue = 'hand ' + id +
                    '\n x = ' + gauche.pos.x.toFixed(2) +
                    '\n y = ' + gauche.pos.y.toFixed(2) +
                    '\n z = ' + gauche.pos.z.toFixed(2);
                trace.setAttribute('value', newvalue);
            }
        }
    });

    // MODULE FLY
    AFRAME.registerComponent('fly', {
        schema: {
            trace: {
                type: 'boolean',
                default: false
            },
            vrmode: {
                type: 'boolean',
                default: false
            },
            scalaire: {
                type: 'vec3',
                default: {
                    x: 0.01,
                    y: 0.01,
                    z: 0.01
                }
            }
        },
        init: function () {
            var scalaire = new THREE.Vector3(this.data.scalaire.x, this.data.scalaire.y, this.data.scalaire.z);
            var player = this.el;
            // var trace = this.data.trace;

            //el.setAttribute('fly', 'trace', false);

            var lefthand = document.getElementById('lefthand');
            lefthand.addEventListener("ybuttondown", function (event) {
                console.log("evt: ybuttondown");
                if (info) {
                    info = false;
                } else {
                    info = true;
                }
            });
            var lefthand = document.getElementById('lefthand');
            lefthand.addEventListener("xbuttondown", function (event) {
                console.log("evt: xbuttondown");
                player.setAttribute('position', {
                    x: 0,
                    y: 0,
                    z: 0
                });
            });

            var navigateur = navigator.userAgent;
            if (navigateur.includes("Quest")) {
                vrmode = true;
                console.log("vrmode = OCULUS");
            } else {
                vrmode = false;
                console.log("vrmode = ORDI");
                var player = this.el;

                // DESKTOP MODE
                window.addEventListener('keydown', function (event) {
                    if (event.key === 'y') {
                        console.log(player.id + " evt: ykeydown");
                        var position = player.getAttribute('position');
                        position.y += scalaire.y*10;
                        player.setAttribute('position', position);
                    }
                    if (event.key === 'u') {
                        console.log(player.id + " evt: ukeydown");
                        var position = player.getAttribute('position');
                        position.y -= scalaire.y*10;
                        player.setAttribute('position', position);
                    }
                    if (event.key === 'o') {
                        console.log(player.id + " evt: ukeydown");
                        var position = player.getAttribute('position');
                        position.y = 0;
                        player.setAttribute('position', position);
                    }
                });


            }
        },
        tick: function () {

            if (vrmode) {
                var position = this.el.getAttribute('position');
                var delta_x = scalaire.x * (gauche.pos.x + droite.pos.x) / 2;
                var delta_y = scalaire.y * ((gauche.pos.y + droite.pos.y) / 2 - 1);
                var delta_z = scalaire.z * (gauche.pos.z + droite.pos.z) / 2;

                position.x += delta_x;
                position.y += delta_y;
                position.z += delta_z;
                this.el.setAttribute('position', position);

                if (this.data.trace) {
                    var trace = document.querySelector('#txtlog');
                    var newvalue = 'entity = ' + this.el.id +
                        '\n useragent = QUEST' +
                        '\n gauche_x = ' + gauche.pos.x.toFixed(2) +
                        '\n gauche_z = ' + gauche.pos.z.toFixed(2) +
                        '\n delta_x = ' + delta_x.toFixed(4) +
                        '\n delta_y = ' + delta_y.toFixed(4) +
                        '\n delta_z = ' + delta_z.toFixed(4) +
                        '\n scalaire.y = ' + scalaire.y +
                        '\n position.y = ' + position.y.toFixed(2) +
                        '\n player.pos.y = ' + player.pos.y.toFixed(2);
                    if (!info) newvalue = "";
                    trace.setAttribute('value', newvalue);
                }
            } else {
                if (this.data.trace) {
                    var trace = document.querySelector('#txtlog');
                    var position = this.el.getAttribute('position');
                    var newvalue = 'entity = ' + this.el.id +
                        '\n useragent = ORDI' +
                        '\n position.y = ' + position.y.toFixed(2) +
                        '\n player.pos.y = ' + player.pos.y.toFixed(2);
                    if (!info) newvalue = "";
                    trace.setAttribute('value', newvalue);
                }
            }
        },
    });

    // CHANGE SKY
    AFRAME.registerComponent('change-sky', {
        init: function () {
            var skyEl = document.querySelector('#image-360');
            var assets = document.querySelectorAll('img[id^="sky"]');
            var currentIndex = 0;

            window.addEventListener('keydown', function (event) {
                if (event.key === 'c') {
                    currentIndex = (currentIndex + 1) % assets.length;
                    var newAssetId = assets[currentIndex].getAttribute('id');
                    skyEl.setAttribute('src', '#' + newAssetId);
                    console.log("new sky = #" + newAssetId);
                }
            });

            var righthand = document.getElementById('righthand');
            righthand.addEventListener("abuttondown", function (event) {
                console.log("evt: abuttondown");
                currentIndex = (currentIndex + 1) % assets.length;
                var newAssetId = assets[currentIndex].getAttribute('id');
                skyEl.setAttribute('src', '#' + newAssetId);
                console.log("new sky = #" + newAssetId);
            });

        }
    });