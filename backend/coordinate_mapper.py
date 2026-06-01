MAP_CONFIG = {

    "AmbroseValley": {
        "scale": 900,
        "origin_x": -370,
        "origin_z": -473
    },

    "GrandRift": {
        "scale": 581,
        "origin_x": -290,
        "origin_z": -290
    },

    "Lockdown": {
        "scale": 1000,
        "origin_x": -500,
        "origin_z": -500
    }
}

def world_to_pixel(map_name, x, z):

    config = MAP_CONFIG[map_name]

    u = (x - config["origin_x"]) / config["scale"]

    v = (z - config["origin_z"]) / config["scale"]

    pixel_x = u * 1024

    pixel_y = (1 - v) * 1024

    return pixel_x, pixel_y