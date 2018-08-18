import base64

"""
Utility functions.
"""


def dict_get(dictionary, name, def_value):
    """
    Returns the value from the dictionary or a default value if the key does not exist.

    :param dict dictionary: dictioanry to get the value from
    :param string name: name of the key
    :param object def_value: default value to use if the key does not exist
    :return: value from the dictionary or a default value if the key not exist
    """
    return dictionary[name] if name in dictionary else def_value


def base64_encode(byte_content):
    """
    Encodes Bytes object as Base64 string

    :param Bytes byte_content: bytes to encode
    :return: pure (without b'...' wrapper) Base64 encodes sring
    """
    return str(base64.b64encode(byte_content))[2:-1]
