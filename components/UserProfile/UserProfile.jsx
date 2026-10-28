"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UploadField } from "../../app/complete-profile/ProfileForm";
import { PROFILE_API_URL, profileAssetUrl, profileValues, saveProfile } from "./profile";
import formStyles from "../../app/register/register.module.css";
import styles from "./user-profile.module.css";

function useLocations(path, revision) {
    const [result, setResult] = useState({ path: null, items: [], error: "" });
    useEffect(() => {
        if (!path) return;
        const controller = new AbortController();
        axios
            .get(`${PROFILE_API_URL}${path}`, { signal: controller.signal, timeout: 30000 })
            .then(({ data }) => {
                if (data?.status !== "success" || !Array.isArray(data.data)) throw new Error(data?.message || "Unable to load locations.");
                if (!controller.signal.aborted) setResult({ path, items: data.data, error: "" });
            })
            .catch((failure) => {
                if (!controller.signal.aborted) setResult({ path, items: [], error: failure.response?.data?.message || failure.message || "Unable to load locations." });
            });
        return () => controller.abort();
    }, [path, revision]);
    return {
        items: result.path === path ? result.items : [],
        loading: Boolean(path) && result.path !== path,
        error: result.path === path ? result.error : ""
    };
}

function LocationField({ label, name, value, savedName, locations, editing, disabled, onChange }) {
    const found = locations.items.find((item) => String(item.id) === value);
    return (
        <label className={formStyles.field}>
            {label} <span className={formStyles.required}>*</span>
            {editing ? (
                <select name={name} value={value} disabled={disabled || locations.loading} onChange={onChange} required>
                    <option value="">{locations.loading ? "Loading…" : `Select ${label}`}</option>
                    {value && !found && <option value={value}>{savedName || value}</option>}
                    {locations.items.map((item) => (
                        <option key={item.id} value={String(item.id)}>
                            {item.name}
                        </option>
                    ))}
                </select>
            ) : (
                <input value={savedName || found?.name || value || "Not provided"} readOnly />
            )}
        </label>
    );
}

export default function UserProfile({ onClose }) {
    const { user, token, refreshUser } = useAuth();
    const dialog = useRef(null);
    const heading = useRef(null);
    const nameInput = useRef(null);
    const saving = useRef(false);
    const [values, setValues] = useState(() => profileValues(user));
    const [editing, setEditing] = useState(false);
    const [busy, setBusy] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [document, setDocument] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [needsReload, setNeedsReload] = useState(false);
    const [locationRevision, setLocationRevision] = useState(0);
    const countries = useLocations("/get_all_country/", locationRevision);
    const states = useLocations(values.country ? `/get_states_by_country/${encodeURIComponent(values.country)}` : null, locationRevision);
    const cities = useLocations(
        values.country && values.state ? `/get_city_by_country_and_state/${encodeURIComponent(values.country)}/${encodeURIComponent(values.state)}` : null,
        locationRevision
    );
    const locationError = countries.error || states.error || cities.error;
    const locationLoading = countries.loading || states.loading || cities.loading;
    const documents = Array.isArray(user?.documents) ? user.documents : [];

    useEffect(() => {
        const element = dialog.current;
        const previousOverflow = window.document.body.style.overflow;
        element.showModal();
        heading.current?.focus();
        window.document.body.style.overflow = "hidden";
        return () => {
            element.close();
            window.document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        if (!editing) return;
        nameInput.current?.focus({ preventScroll: true });
        nameInput.current?.select();
        dialog.current?.scrollTo({ top: 0 });
    }, [editing]);

    function close() {
        if (!saving.current) onClose();
    }

    function change(event) {
        setValues({ ...values, [event.target.name]: event.target.value });
        setNotice("");
    }

    function cancelEdit() {
        setValues(profileValues(user));
        setPhoto(null);
        setDocument(null);
        setEditing(false);
        setError("");
        setNotice("");
    }

    async function submit(event) {
        event.preventDefault();
        if (!editing || saving.current) return;
        saving.current = true;
        setBusy(true);
        setError("");
        setNotice("");
        let saved = needsReload;
        try {
            if (!saved) {
                await saveProfile({ values, photo, document, token });
                saved = true;
                setNeedsReload(true);
            }
            const refreshed = await refreshUser(token);
            setValues(profileValues(refreshed));
            setPhoto(null);
            setDocument(null);
            setNeedsReload(false);
            setEditing(false);
            setNotice("Your profile has been updated.");
        } catch (failure) {
            setError(
                saved
                    ? "Your profile was saved, but could not be reloaded. Click Reload Profile to try again."
                    : failure.response?.data?.message || failure.message || "Unable to update your profile."
            );
        } finally {
            saving.current = false;
            setBusy(false);
        }
    }

    return (
        <dialog
            ref={dialog}
            className={styles.dialog}
            aria-labelledby="user-profile-title"
            onCancel={(event) => {
                event.preventDefault();
                close();
            }}
        >
            <div className={styles.content} aria-busy={busy}>
                <button type="button" className={styles.close} aria-label="Close profile" disabled={busy} onClick={close}>
                    ×
                </button>
                <h2 id="user-profile-title" tabIndex={-1} ref={heading} className={styles.title}>
                    My Profile
                </h2>
                <div className={styles.editHeader}>
                    <p id="profile-edit-help">{editing ? "Select a highlighted field to update your details." : "Click Edit Profile to update your details."}</p>
                    {!editing && (
                        <button
                            type="button"
                            className={formStyles.primaryButton}
                            onClick={() => {
                                setEditing(true);
                                setNotice("");
                            }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
                <form className={`${formStyles.form} ${styles.form}`} data-editing={editing} aria-describedby="profile-edit-help" onSubmit={submit}>
                    <div className={formStyles.profileUpload}>
                        <UploadField
                            key={`${editing}:${user?.profile_image || user?.profile_picture || ""}`}
                            kind="profile"
                            label="Profile Image"
                            file={photo}
                            onSelect={setPhoto}
                            disabled={!editing || busy || needsReload}
                            initialPreview={profileAssetUrl(user?.profile_image || user?.profile_picture)}
                        />
                    </div>
                    <fieldset className={`${formStyles.fields} ${styles.fields}`} disabled={busy || needsReload}>
                        <label className={formStyles.field}>
                            Full Name <span className={formStyles.required}>*</span>
                            <input ref={nameInput} name="name" value={values.name} readOnly={!editing} onChange={change} maxLength={120} autoComplete="name" required />
                        </label>
                        <label className={formStyles.field}>
                            Email
                            <input type="email" value={user?.email || ""} readOnly autoComplete="email" aria-describedby="profile-email-locked" />
                            <small id="profile-email-locked" className={styles.lockedHelp}>
                                Cannot be changed
                            </small>
                        </label>
                        <label className={formStyles.field}>
                            Mobile Number
                            <input type="tel" value={user?.mobile || user?.mobile_no || ""} readOnly autoComplete="tel" aria-describedby="profile-mobile-locked" />
                            <small id="profile-mobile-locked" className={styles.lockedHelp}>
                                Cannot be changed
                            </small>
                        </label>
                        <label className={formStyles.field}>
                            Gender <span className={formStyles.required}>*</span>
                            {editing ? (
                                <select name="gender" value={values.gender} onChange={change} required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    {values.gender && !["male", "female"].includes(values.gender) && <option value={values.gender}>{values.gender}</option>}
                                </select>
                            ) : (
                                <input value={values.gender} readOnly className={styles.gender} />
                            )}
                        </label>
                        <LocationField
                            label="Country"
                            name="country"
                            value={values.country}
                            savedName={values.country === String(user?.country) ? user?.country_name : ""}
                            locations={countries}
                            editing={editing}
                            onChange={(event) => setValues({ ...values, country: event.target.value, state: "", city: "" })}
                        />
                        <LocationField
                            label="State"
                            name="state"
                            value={values.state}
                            savedName={values.state === String(user?.state) ? user?.state_name : ""}
                            locations={states}
                            editing={editing}
                            disabled={!values.country}
                            onChange={(event) => setValues({ ...values, state: event.target.value, city: "" })}
                        />
                        <LocationField
                            label="City"
                            name="city"
                            value={values.city}
                            savedName={values.city === String(user?.city) ? user?.city_name : ""}
                            locations={cities}
                            editing={editing}
                            disabled={!values.state}
                            onChange={change}
                        />
                        <label className={formStyles.field}>
                            Pincode <span className={formStyles.required}>*</span>
                            <input name="zipcode" value={values.zipcode} readOnly={!editing} onChange={change} autoComplete="postal-code" maxLength={12} required />
                        </label>
                        <label className={`${formStyles.field} ${formStyles.address}`}>
                            Address <span className={formStyles.required}>*</span>
                            <textarea
                                name="location"
                                value={values.location}
                                readOnly={!editing}
                                onChange={change}
                                autoComplete="street-address"
                                rows={3}
                                maxLength={500}
                                required
                            />
                        </label>
                    </fieldset>
                    <div className={styles.documents}>
                        <h3>Document</h3>
                        {documents.length ? (
                            <ul>
                                {documents.map((item, index) => {
                                    const url = profileAssetUrl(item.fileUrl || item.file, "uploads/users/documents");
                                    return (
                                        <li key={`${item.file || item.fileUrl}:${index}`}>
                                            {url ? (
                                                <a href={url} target="_blank" rel="noopener noreferrer">
                                                    {item.name || `Profile Document ${index + 1}`}
                                                </a>
                                            ) : (
                                                item.name || "Document unavailable"
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No document uploaded.</p>
                        )}
                        {editing && <UploadField kind="document" label="Document" file={document} onSelect={setDocument} disabled={busy || needsReload} />}
                    </div>
                    {locationError && (
                        <p className={styles.locationError} role="status">
                            {locationError} Your saved locations are kept.{" "}
                            <button type="button" disabled={busy} onClick={() => setLocationRevision((revision) => revision + 1)}>
                                Retry loading locations
                            </button>
                        </p>
                    )}
                    {error && (
                        <p className={formStyles.error} role="alert">
                            {error}
                        </p>
                    )}
                    {notice && (
                        <p className={styles.success} role="status">
                            {notice}
                        </p>
                    )}
                    {editing && (
                        <div className={styles.actions}>
                            <button type="submit" className={formStyles.primaryButton} disabled={busy || (!needsReload && locationLoading)}>
                                {busy ? "Saving…" : needsReload ? "Reload Profile" : "Save Changes"}
                            </button>
                            {!needsReload && (
                                <button type="button" className={styles.secondary} disabled={busy} onClick={cancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </dialog>
    );
}
