#include <stdio.h> 
#include <stdlib.h> 
#include <emscripten.h>


// EM_JS(void, render, (), {
// 	strand.pixels.set(strand.wasmPixels);
// 	ws281x.render(strand.pixels);
//  	throw 'all done';	
// });

  
 EM_JS(void, NoReturnValueWithNoParameters, (), {
   console.log("NoReturnValueWithNoParameters called");
 });


int x;
int num_pixels;

uint32_t * alloc_pixels(int n_pixels)
{
	x = 0;
	num_pixels = n_pixels;

	uint32_t *ptr;

    /*get the free mem idx*/
    ptr = (uint32_t*)malloc(num_pixels * 4); 
    return ptr;
}


/* ------------------------------- */
void assign_pixel(uint32_t * strand, int i, int color) {
	strand[i] = color;
}

void assign_strand(uint32_t * strand, int color) {
	int i;
	for (i=0; i<=num_pixels; i++) {
		strand[i] = color;
	}
	// render();
}

int make_scaled_color(int r, int g, int b, float sc) {
	//return (white << 24) | (red << 16)| (green << 8) | blue;
	return ( (int)(g*sc) << 16) | ((int)(r*sc) << 8) | (int)(b*sc);
}

int make_color(int r, int g, int b) {
	//return (white << 24) | (red << 16)| (green << 8) | blue;
	return (g << 16) | (r << 8) | b;
}


void all_off(uint32_t * pixels) {
	int i;
	for (i=0; i<=num_pixels; i++) {
		pixels[i] = 0;
	}	
}

void tick(uint32_t * pixels) {

	if (x==0) {
		all_off(pixels);
	}

	int i;
	for (i=0; i<=x; i++) {
		pixels[i] = 255;
	}

	x++;
	x %= num_pixels;
}



int add(int a, int b) {
	NoReturnValueWithNoParameters();
	return a + b;
}

/*
emcc add.c -O2 -s "EXPORTED_FUNCTIONS=['_add', '_alloc_pixels', '_plus_one', '_all_off', '_tick']" -s WASM=1 -o add.wasm 
emcc add.c -O2 -s "EXPORTED_FUNCTIONS=['_***']" -s SIDE_MODULE=1 -s WASM=1 -o add.wasm 


emcc add.c -O2 -s "EXPORTED_FUNCTIONS=['_add', '_alloc_pixels']" -s SIDE_MODULE=1 -s WASM=1 -o add.wasm 
emcc add.c -O2 -s "EXPORTED_FUNCTIONS=['_add', '_alloc_pixels']" -s WASM=1 -o add.wasm 
*/

// notes - 
// wasm uses dlmalloc
// https://stackoverflow.com/questions/57032577/how-to-implement-malloc-in-wasm


// CRITICAL root: Cannot find emsdk/upstream/bin/lli, check the paths in ~/.emscripten
