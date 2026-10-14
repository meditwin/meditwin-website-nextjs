"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "../register/register.module.css";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.carencurewellness.com").replace(/\/+$/, "");

function UploadIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 24H7a5 5 0 0 1-1-10 10 10 0 0 1 19-1 6 6 0 0 1 0 12h-3M16 28V15m-5 5 5-5 5 5" />
        </svg>
    );
}

function CameraIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M3 7h4l2-3h6l2 3h4v13H3z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

function UploadField({ kind, label, file, onSelect, disabled }) {
    const dialog = useRef(null);
    const input = useRef(null);
    const nativeCamera = useRef(null);
    const video = useRef(null);
    const stream = useRef(null);
    const trigger = useRef(null);

    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState("");
    const isProfile = kind === "profile";

    const [preview, setPreview] = useState("");

    useEffect(
        () => () => {
            if (preview) URL.revokeObjectURL(preview);
        },
        [preview]
    );

    useEffect(() => {
        return () => {
            stream.current?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    function stopCamera() {
        stream.current?.getTracks().forEach((t) => t.stop());
        stream.current = null;
        setCameraOpen(false);
        setCameraReady(false);
    }

    function close() {
        stopCamera();
        dialog.current?.close();
        trigger.current?.focus();
    }

    function selectFile(selected) {
        if (!selected) return;

        const allowed = isProfile ? ["image/jpeg", "image/png"] : ["image/jpeg", "image/png", "application/pdf"];

        if (!allowed.includes(selected.type)) {
            setError("Please select a valid JPG, PNG or PDF file.");
            return;
        }

        if (selected.size > 5 * 1024 * 1024) {
            setError("Maximum file size is 5 MB.");
            return;
        }

        setError("");
        setPreview(selected.type.startsWith("image/") ? URL.createObjectURL(selected) : "");
        onSelect(selected);
        close();
    }

    async function openCamera() {
        setError("");

        if (!navigator.mediaDevices?.getUserMedia) {
            nativeCamera.current?.click();
            return;
        }

        setCameraOpen(true);

        try {
            const camera = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: isProfile ? "user" : "environment"
                },
                audio: false
            });

            if (!dialog.current?.open || !video.current) {
                camera.getTracks().forEach((t) => t.stop());
                return;
            }

            stream.current = camera;
            video.current.srcObject = camera;
            await video.current.play();
            setCameraReady(true);
        } catch {
            stopCamera();
            setError("Unable to access camera. Please upload a file.");
        }
    }

    function capture() {
        const player = video.current;
        if (!player?.videoWidth) return;

        const canvas = document.createElement("canvas");
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
        canvas.getContext("2d").drawImage(player, 0, 0);

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    selectFile(new File([blob], `${kind}-${Date.now()}.jpg`, { type: "image/jpeg" }));
                }
            },
            "image/jpeg",
            0.9
        );
    }

    return (
        <div className={styles.uploadField}>
            {isProfile ? (
                <>
                    <button ref={trigger} type="button" className={styles.profileButton} disabled={disabled} onClick={() => dialog.current?.showModal()}>
                        {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={preview} className={styles.profilePreview} alt="Profile preview" />
                        ) : (
                            <svg className={styles.profilePlaceholder} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <circle cx="24" cy="17" r="8" />
                                <path d="M9 41v-4a15 15 0 0 1 30 0v4" />
                            </svg>
                        )}
                        <span className={styles.cameraBadge}>
                            <CameraIcon />
                        </span>
                    </button>
                    <p className={styles.profileLabel}>
                        Profile Image <span className={styles.required}>*</span>
                    </p>
                    <p className={styles.profileHelp}>{file?.name || "JPG or PNG (Max 5MB)"}</p>
                </>
            ) : (
                <button ref={trigger} type="button" className={styles.uploadCard} disabled={disabled} onClick={() => dialog.current?.showModal()}>
                    {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} className={styles.preview} alt="Document preview" />
                    ) : (
                        <UploadIcon />
                    )}
                    <span>
                        {file ? "Change Document" : "Upload Document"} <span className={styles.required}>*</span>
                    </span>
                    <small>{file?.name || "JPG, PNG or PDF (Max 5MB)"}</small>
                    <span className={styles.cameraHint}>Camera or upload file</span>
                </button>
            )}

            <input
                ref={input}
                type="file"
                hidden
                accept={isProfile ? "image/jpeg,image/png" : "image/jpeg,image/png,application/pdf"}
                onChange={(e) => {
                    selectFile(e.target.files?.[0]);
                    e.target.value = "";
                }}
            />

            <input
                ref={nativeCamera}
                type="file"
                hidden
                accept="image/*"
                capture={isProfile ? "user" : "environment"}
                onChange={(e) => {
                    selectFile(e.target.files?.[0]);
                    e.target.value = "";
                }}
            />

            <dialog
                ref={dialog}
                className={styles.dialog}
                aria-labelledby={`${kind}-dialog-heading`}
                onCancel={stopCamera}
                onClose={stopCamera}
                onClick={(e) => {
                    if (e.target === e.currentTarget) close();
                }}
            >
                <div className={styles.dialogHeading}>
                    <h2 id={`${kind}-dialog-heading`}>{label}</h2>
                    <button type="button" className={styles.closeButton} onClick={close} aria-label="Close">
                        ×
                    </button>
                </div>

                {cameraOpen ? (
                    <>
                        <video ref={video} className={styles.video} autoPlay muted playsInline />
                        <button type="button" className={styles.primaryButton} disabled={!cameraReady} onClick={capture}>
                            {cameraReady ? "Take Photo" : "Opening Camera..."}
                        </button>
                        <button type="button" className={styles.optionButton} onClick={stopCamera}>
                            Back
                        </button>
                    </>
                ) : (
                    <div className={styles.options}>
                        <button type="button" className={styles.optionButton} onClick={openCamera}>
                            <CameraIcon />
                            Open Camera
                        </button>
                        <button type="button" className={styles.optionButton} onClick={() => input.current?.click()}>
                            <UploadIcon />
                            Upload File
                        </button>
                    </div>
                )}

                {error && <p className={styles.error}>{error}</p>}
            </dialog>
        </div>
    );
}

export default function ProfileForm() {
    const router = useRouter();
    const { completeProfile, user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [document, setDocument] = useState(null);

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    const [loading, setLoading] = useState(false);
    const [countryLoading, setCountryLoading] = useState(true);
    const [stateLoading, setStateLoading] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);

    const [error, setError] = useState("");

    // Fetch countries.
    useEffect(() => {
        let active = true;

        axios
            .get(`${API_URL}/get_all_country/`)
            .then((res) => {
                if (res.data.status !== "success") {
                    throw new Error(res.data.message || "Country API failed");
                }
                if (active) setCountries(res.data.data || []);
            })
            .catch((err) => {
                if (active) setError(err.message);
            })
            .finally(() => {
                if (active) setCountryLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    // Fetch states.
    useEffect(() => {
        if (!country) return;

        let active = true;

        axios
            .get(`${API_URL}/get_states_by_country/${country}`)
            .then((res) => {
                if (res.data.status !== "success") {
                    throw new Error(res.data.message || "State API failed");
                }
                if (active) setStates(res.data.data || []);
            })
            .catch((err) => {
                if (active) setError(err.message);
            })
            .finally(() => {
                if (active) setStateLoading(false);
            });

        return () => {
            active = false;
        };
    }, [country]);

    // Fetch cities.
    useEffect(() => {
        if (!country || !state) return;

        let active = true;

        axios
            .get(`${API_URL}/get_city_by_country_and_state/${country}/${state}`)
            .then((res) => {
                if (res.data.status !== "success") {
                    throw new Error(res.data.message || "City API failed");
                }
                if (active) setCities(res.data.data || []);
            })
            .catch((err) => {
                if (active) setError(err.message);
            })
            .finally(() => {
                if (active) setCityLoading(false);
            });

        return () => {
            active = false;
        };
    }, [country, state]);

    // Complete the account created by email OTP login.
    async function submit(e) {
        e.preventDefault();
        if (loading) return;

        setError("");

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const name = String(data.fullName || "").trim();
        const email = user.email;
        const gender = String(data.gender || "").trim();
        // const mobile = String(data.phoneNumber || "").trim();
        const zipcode = String(data.pincode || "").trim();
        const address = String(data.address || "").trim();

        if (!name || !email || !gender || !country || !state || !city || !zipcode || !address) {
            setError("Please fill in all required fields.");
            return;
        }

        if (!profile || !document) {
            setError("Please upload profile image and document.");
            return;
        }

        setLoading(true);

        try {
            const userData = {
                name,
                email,
                // mobile,
                gender,
                country: String(country),
                state: String(state),
                city: String(city),
                zipcode,
                location: address,
                user_role: 4,
                verification_status: 1,
                status: 1,
                documents: [{ name: "Profile Document", file: null }]
            };

            const formData = new FormData();

            formData.append("user_data", JSON.stringify(userData));
            formData.append("profile_image", profile);
            formData.append("documents", document);

            await completeProfile(formData);

            router.replace("/booking");
        } catch (err) {
            const detail = err.response?.data?.detail;

            setError(
                err.response?.data?.message ||
                    (Array.isArray(detail) ? detail.map((x) => x.msg).join(", ") : typeof detail === "string" ? detail : null) ||
                    err.message ||
                    "Unable to save your profile. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={submit}>
            <div className={styles.profileUpload}>
                <UploadField kind="profile" label="Profile Image" file={profile} onSelect={setProfile} disabled={loading} />
            </div>

            <fieldset className={styles.fields} disabled={loading}>
                <label className={styles.field}>
                    Full Name <span className={styles.required}>*</span>
                    <input name="fullName" placeholder="Enter your name" autoComplete="name" maxLength={120} required />
                </label>

                <label className={styles.field}>
                    Email <span className={styles.required}>*</span>
                    <input name="email" type="email" value={user.email} readOnly autoComplete="email" required />
                </label>

                {/* <label className={styles.field}>
                    Phone Number <span className={styles.required}>*</span>
                    <input name="phoneNumber" type="tel" placeholder="Enter your phone number" autoComplete="tel" required />
                </label> */}

                <label className={styles.field}>
                    Gender <span className={styles.required}>*</span>
                    <select name="gender" defaultValue="" required>
                        <option value="" disabled>
                            Select Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>

                <label className={styles.field}>
                    Country <span className={styles.required}>*</span>
                    <select
                        name="country"
                        value={country}
                        disabled={countryLoading}
                        onChange={(e) => {
                            setCountry(e.target.value);
                            setStateLoading(Boolean(e.target.value));
                            setCityLoading(false);
                            setState("");
                            setCity("");
                            setStates([]);
                            setCities([]);
                        }}
                        required
                    >
                        <option value="">Select Country</option>
                        {countries.map((item) => (
                            <option key={item.id} value={String(item.id)}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.field}>
                    State <span className={styles.required}>*</span>
                    <select
                        name="state"
                        value={state}
                        disabled={!country || stateLoading}
                        onChange={(e) => {
                            setState(e.target.value);
                            setCityLoading(Boolean(e.target.value));
                            setCity("");
                            setCities([]);
                        }}
                        required
                    >
                        <option value="">{stateLoading ? "Loading..." : "Select State"}</option>
                        {states.map((item) => (
                            <option key={item.id} value={String(item.id)}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.field}>
                    City <span className={styles.required}>*</span>
                    <select name="city" value={city} disabled={!state || cityLoading} onChange={(e) => setCity(e.target.value)} required>
                        <option value="">{cityLoading ? "Loading..." : "Select City"}</option>
                        {cities.map((item) => (
                            <option key={item.id} value={String(item.id)}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.field}>
                    Pincode <span className={styles.required}>*</span>
                    <input name="pincode" placeholder="Enter your pincode" autoComplete="postal-code" maxLength={12} required />
                </label>

                <label className={`${styles.field} ${styles.address}`}>
                    Address <span className={styles.required}>*</span>
                    <textarea name="address" placeholder="Enter your full address" autoComplete="street-address" rows={3} maxLength={500} required />
                </label>
            </fieldset>

            <div className={styles.uploads}>
                <UploadField kind="document" label="Document" file={document} onSelect={setDocument} disabled={loading} />
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            <div className={styles.actions}>
                <button type="submit" className={styles.primaryButton} disabled={loading || countryLoading || stateLoading || cityLoading}>
                    {loading ? "Saving Profile..." : "Complete Profile & Continue"}
                </button>
            </div>
        </form>
    );
}
