import binascii, os, random


class ResetTokenGenerator:
    def __init__(self, min_length=20, max_lenth=24):

        self.min_length = min_length
        self.max_length = max_lenth

    def make_token(self):

        length = random.randint(self.min_length, self.max_length)

        return binascii.hexlify(os.urandom(length)).decode()
