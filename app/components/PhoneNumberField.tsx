import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"

export default function PhoneNumberField() {
    const [phone, setPhone] = useState<string | undefined>();

    return (
        <PhoneInput
            className="input"
            international
            defaultCountry="KE"
            value={phone}
            onChange={setPhone}
            placeholder="PhoneNumber"
        />
    )
}