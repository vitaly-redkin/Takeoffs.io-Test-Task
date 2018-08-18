import base64

def dict_get(dict, name, def_value):
    return dict[name] if name in dict else def_value

def base64_encode(byte_content):
    return str(base64.b64encode(byte_content))[2:-1]