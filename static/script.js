// function to convert HSV values to RGB
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
function HSVtoRGB(h, s, v) {
    let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);

    return {
        r: Math.round(f(5)*255),
        g: Math.round(f(3)*255),
        b: Math.round(f(1)*255)
    };
}

// function to convert RGB values to HSV
// input: r,g,b in [0,255], out: h in [0,360) and s,v in [0,1]
function RGBtoHSV(r_, g_, b_) {
    let r = r_/255;
    let g = g_/255;
    let b = b_/255;

    let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
    let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 

    return {
        h: 60*(h<0?h+6:h),
        s: v&&c/v,
        v: v
    };
}

// function to convert RGB values to HEX
// input: r,g,b in [0,255]
function RGBtoHEX(r, g, b) {
    return (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

// function to convert HEX values to RGB
function HEXtoRGB(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

document.addEventListener('DOMContentLoaded', function() {

    // to update color by HEX CODE
    function update_hex_color() {

        // get context
        const target = document.querySelector('.preview-area');
        const hexInput = document.getElementById('hex-code');
    
        // transform input into css format
        const hexColor = "#".concat(hexInput.value)

        // change css style
        target.style.background = hexColor;

        // get color equivalents to change other field based on this choice
        const rgbTriplet = HEXtoRGB(hexColor)
        const hsvTriplet = rgbTriplet ? RGBtoHSV(rgbTriplet.r, rgbTriplet.g, rgbTriplet.b) : null;

        // hexReverse is needed to transform e.g. #0f0 to #00ff00 that is needed at input type = color .value
        const hexReverse = rgbTriplet ? "#".concat(RGBtoHEX(rgbTriplet.r, rgbTriplet.g, rgbTriplet.b)) : null;

        // return values to use on another fields
        return rgbTriplet ? {
            hex: hexReverse,
            r: rgbTriplet.r,
            g: rgbTriplet.g,
            b: rgbTriplet.b,
            h: hsvTriplet.h,
            s: hsvTriplet.s,
            v: hsvTriplet.v
        } : null;

    }

    // to update color by RGB
    function update_rgb_color() {

        // get context
        const target = document.querySelector('.preview-area');
        const r = document.getElementById('rgb-r-code').value;
        const g = document.getElementById('rgb-g-code').value;
        const b = document.getElementById('rgb-b-code').value;
    
        // change css style
        target.style.background = 'rgb(' + [r,g,b].join(',') + ')';

        // get color equivalents to change other field based on this choice
        const hexCode = RGBtoHEX(r, g, b)
        const hsvTriplet = RGBtoHSV(r, g, b)

        // return values to use on another fields
        return {
            hex: hexCode,
            h: hsvTriplet.h,
            s: hsvTriplet.s,
            v: hsvTriplet.v
        };
    }

    // to update color by HSV
    function update_hsv_color() {

        // get context
        const target = document.querySelector('.preview-area');
        const h = document.getElementById('hsv-h-code').value;
        const s = document.getElementById('hsv-s-code').value;
        const v = document.getElementById('hsv-v-code').value;

        // transform input into css format
        const result = HSVtoRGB(h, s, v);
        let r = result.r;
        let g = result.g;
        let b = result.b;
    
        // change css style
        target.style.background = 'rgb(' + [r,g,b].join(',') + ')';

        // get color equivalents to change other field based on this choice
        const hexCode = RGBtoHEX(r, g, b)

        // return values to use on another fields
        return {
            hex: hexCode,
            r: r,
            g: g,
            b: b
        };
    }

    // to update color by HSV
    function update_picker_color() {

        // get context
        const target = document.querySelector('.preview-area');
        const color = document.getElementById('picker-code').value;

        // change css style
        target.style.background = color;

        // get color equivalents to change other field based on this choice
        const rgbTriplet = HEXtoRGB(color)
        const hsvTriplet = rgbTriplet ? RGBtoHSV(rgbTriplet.r, rgbTriplet.g, rgbTriplet.b) : null;
   
        // hexReverse is needed to transform e.g. #0f0 to #00ff00 that is needed at input type = color .value
        const hexReverse = rgbTriplet ? RGBtoHEX(rgbTriplet.r, rgbTriplet.g, rgbTriplet.b) : null;

        // return values to use on another fields
        return rgbTriplet ? {
            hex: hexReverse,
            r: rgbTriplet.r,
            g: rgbTriplet.g,
            b: rgbTriplet.b,
            h: hsvTriplet.h,
            s: hsvTriplet.s,
            v: hsvTriplet.v
        } : null;

    }

    function update_color() {

        // get context
        const hex = document.getElementById('hex-selection');
        const rgb = document.getElementById('rgb-selection');
        const hsv = document.getElementById('hsv-selection');
        const picker = document.getElementById('picker-selection');

        // disable all input options except radio selections by default
        document.querySelectorAll("input:not(.radio-selection)").forEach(item => {
            item.setAttribute('disabled', true);
        })

        // check what radio button the user checked
        // enable field of that selection
        // update the resulting color
        // update other disabled fields with its color equivalent
        if(hex.checked){

            // enable when selected 
            hex.parentElement.querySelectorAll("input").forEach(item => {
                item.removeAttribute('disabled')
            })
            
            // run function to update by hex input
            hexResult = update_hex_color();

            // change RGB fields based on current HEX selection
            document.getElementById('rgb-r-code').value = hexResult ? hexResult.r : null;
            document.getElementById('rgb-g-code').value = hexResult ? hexResult.g : null;
            document.getElementById('rgb-b-code').value = hexResult ? hexResult.b : null;

            // change HSV fields based on current HEX selection
            document.getElementById('hsv-h-code').value = hexResult ? hexResult.h : null;
            document.getElementById('hsv-s-code').value = hexResult ? hexResult.s : null;
            document.getElementById('hsv-v-code').value = hexResult ? hexResult.v : null;

            // change PICKER fields based on current HEX selection
            document.getElementById('picker-code').value = hexResult ? hexResult.hex : "#000fff";

        } else if(rgb.checked){

            // enable when selected 
            rgb.parentElement.querySelectorAll("input").forEach(item => {
                item.removeAttribute('disabled')
            })
            
            // run function to update by hex input
            rgbResult = update_rgb_color();

            // change RGB fields based on current HEX selection
            document.getElementById('hex-code').value = rgbResult.hex;

            // change HSV fields based on current HEX selection
            document.getElementById('hsv-h-code').value = rgbResult.h;
            document.getElementById('hsv-s-code').value = rgbResult.s;
            document.getElementById('hsv-v-code').value = rgbResult.v;

            // change PICKER fields based on current HEX selection
            document.getElementById('picker-code').value = "#".concat(rgbResult.hex);

        } else if(hsv.checked){

            // enable when selected 
            hsv.parentElement.querySelectorAll("input").forEach(item => {
                item.removeAttribute('disabled')
            })
            
            // run function to update by hex input
            hsvResult = update_hsv_color();            

            // change RGB fields based on current HEX selection
            document.getElementById('hex-code').value = hsvResult.hex;

            // change RGB fields based on current HEX selection
            document.getElementById('rgb-r-code').value = hsvResult.r;
            document.getElementById('rgb-g-code').value = hsvResult.g;
            document.getElementById('rgb-b-code').value = hsvResult.b;

            // change PICKER fields based on current HEX selection
            document.getElementById('picker-code').value = "#".concat(hsvResult.hex);

        } else if(picker.checked) {

            // enable when selected 
            picker.parentElement.querySelectorAll("input").forEach(item => {
                item.removeAttribute('disabled')
            })
            
            // run function to update by hex input
            pickerResult = update_picker_color();

            // change RGB fields based on current HEX selection
            document.getElementById('hex-code').value = pickerResult.hex;
            
            // change RGB fields based on current HEX selection
            document.getElementById('rgb-r-code').value = pickerResult.r;
            document.getElementById('rgb-g-code').value = pickerResult.g;
            document.getElementById('rgb-b-code').value = pickerResult.b;

            // change HSV fields based on current HEX selection
            document.getElementById('hsv-h-code').value = pickerResult.h;
            document.getElementById('hsv-s-code').value = pickerResult.s;
            document.getElementById('hsv-v-code').value = pickerResult.v;

        }
        
    }


    // get current context and make changes whenever an input is changed
    var context = document.querySelectorAll('input');

    // goes throught each input tags
    context.forEach(item => {
        // update when chenged
        item.addEventListener("change", function() {
            update_color();
        })
    })

})

