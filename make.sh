emcc add.c -O2 -s "EXPORTED_FUNCTIONS=['_add', '_alloc_pixels', '_plus_one', '_all_off', '_tick', '_assign_pixel', '_make_color']" -s WASM=1 -o add.wasm 
