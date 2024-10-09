import React, { useEffect, useState } from "react";
import styles from "./CreateRole.module.css";
import {
  TextInput,
  SelectOptions,
  MyProfileCheckBox,
  CheckboxInputsGroup,
} from "../../../common/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoles,
  fetchResources,
  fetchRoleById,
  createRole,
  deleteRole,
} from "../../../../redux/slices/roles/rolesSlice";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import { enqueueSnackbar as EnSn } from "notistack";

const CreateRole = () => {
  const dispatch = useDispatch();
  const { roles, resources, selectedRole, status, error } = useSelector(
    (state) => state.roles
  );

  const initialRoleState = {
    add: false,
    read: false,
    update: false,
    delete: false,
  };

  const initialMyProfileState = {
    firstName: false,
    lastName: false,
    middleName: false,
    dateOfBirth: false,
    jshir: false,
    homeAddress: false,
    image: false,
    phoneNumber: false,
  };

  const initialMyCheckBox = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [myProfile, setMyProfile] = useState(initialMyProfileState);
  const [myCheckBox, setMyCheckBox] = useState(initialMyCheckBox);
  const [adminHistory, setAdminHistory] = useState(false);
  const [selectRole, setSelectRole] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [reset, setReset] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const translations = useSelector((state) => state.language.translations);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchResources());
  }, [dispatch]);

  useEffect(() => {
    if (selectRole) {
      dispatch(fetchRoleById(selectRole));
    }
  }, [selectRole, dispatch]);

  useEffect(() => {
    if (selectedRole) {
      setRoleName(selectedRole.name);

      const newPermissions = {};
      selectedRole.permissions.forEach((perm) => {
        newPermissions[perm.resource.id] = {
          add: perm.create || false,
          read: perm.read || false,
          update: perm.update || false,
          delete: perm.delete || false,
        };
      });
      setPermissions(newPermissions);

      setAdminHistory(selectedRole.profile_permissions?.admin_history || false);
    }
  }, [selectedRole]);

  const handleReset = (e) => {
    e.preventDefault();
    setSelectRole("");
    setRoleName("");
    setPermissions({});
    setAdminHistory(false);
    setMyProfile(initialMyProfileState);
    setReset(true);
    setTimeout(() => setReset(false), 0);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      EnSn("Role name is required", { variant: "error" });
      return;
    }

    const newRole = {
      name: roleName,
      permissions: Object.keys(permissions).map((resourceId) => ({
        resource_id: resourceId,
        create: permissions[resourceId].add,
        read: permissions[resourceId].read,
        update: permissions[resourceId].update,
        delete: permissions[resourceId].delete,
      })),
      profile_permissions: {
        admin_history: adminHistory,
        first_name: myProfile.firstName,
        last_name: myProfile.lastName,
        middle_name: myProfile.middleName,
        birth_date: myProfile.dateOfBirth,
        pini: myProfile.jshir,
        phone_number: myProfile.phoneNumber,
        address: myProfile.homeAddress,
        image: myProfile.image,
      },
    };
    setSubmitAttempted(true);
    dispatch(createRole(newRole));
    handleReset(e);
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations.roleCreated, { variant: "success" });
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  const handlePermissionChange = (resourceId, permissionType, value) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [resourceId]: {
        ...prevPermissions[resourceId],
        [permissionType]: value ?? false,
      },
    }));
  };

  // const handleAllChange = (resourceId, value) => {
  //   setPermissions((prevPermissions) => ({
  //     ...prevPermissions,
  //     [resourceId]: {
  //       add: value ?? false,
  //       read: value ?? false,
  //       update: value ?? false,
  //       delete: value ?? false,
  //     },
  //   }));
  // };

  const handleDeleteRole = () => {
    if (selectRole) {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteRole(selectRole)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        EnSn("Role deleted successfully", { variant: "success" });
      } else if (result.meta.requestStatus === "rejected") {
        EnSn(result.payload || "Failed to delete role", {
          variant: "error",
        });
      }
      setSelectRole("");
      setRoleName("");
      setReset(true);
      setTimeout(() => setReset(false), 0);
      setOpenDialog(false);
    });
  };

  return (
    <section className={styles.createRole}>
      <form>
        <div className={styles.formHeader}>
          <div className={styles.header}>
            <TextInput
              text={translations.adminRoleName}
              value={roleName || ""}
              setValue={setRoleName}
            />
            <div className={styles.historyDiv}>
              <label htmlFor="history">{translations.adminAdminHistory}</label>
              <input
                type="checkbox"
                id="history"
                name="history"
                checked={!!adminHistory}
                onChange={(e) => setAdminHistory(e.target.checked)}
              />
              <label htmlFor="history" className={styles.checkbox}>
                <span></span>
              </label>
            </div>
          </div>
          <div className={styles.header}>
            <SelectOptions
              text={translations.adminRole}
              values={roles.map((role) => ({
                name: role.name,
                id: role.id,
              }))}
              value={selectRole || ""}
              setValue={setSelectRole}
            />
          </div>
          {selectRole && (
            <button
              className={styles.deleteButton}
              type="button"
              onClick={handleDeleteRole}
            >
              {translations.adminDelete}
            </button>
          )}
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formContent}>
            {resources
              .slice(0, Math.ceil(resources.length / 2))
              .map((resource) => {
                const resourcePermissions =
                  permissions[resource.id] || initialRoleState;
                const allChecked =
                  Object.values(resourcePermissions).every(Boolean);
                return (
                  <CheckboxInputsGroup
                    key={resource.name}
                    text={resource.name}
                    value={resourcePermissions}
                    id={resource.id}
                    allChecked={allChecked}
                    reset={reset}
                    handleChange={(permType, value) =>
                      handlePermissionChange(resource.id, permType, value)
                    }
                  />
                );
              })}
          </div>

          <div className={styles.formContent}>
            <MyProfileCheckBox
              text={translations.adminMyProfile}
              value={myProfile}
              setValue={setMyProfile}
              typesTitle={Object.keys(initialMyProfileState)}
            />
            {resources
              .slice(Math.ceil(resources.length / 2))
              .map((resource) => {
                const resourcePermissions =
                  permissions[resource.id] || initialRoleState;
                const allChecked =
                  Object.values(resourcePermissions).every(Boolean);
                return (
                  <CheckboxInputsGroup
                    key={resource.name}
                    text={resource.name}
                    value={resourcePermissions}
                    id={resource.id}
                    reset={reset}
                  />
                );
              })}
          </div>
        </div>

        <div className={styles.formButtons}>
          <button type="reset" className={styles.reset} onClick={handleReset}>
            {translations.adminClean}
          </button>
          <button className={styles.create} onClick={handleCreateRole}>
            {translations.adminCreate}
          </button>
        </div>
      </form>

      <ConfirmationDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        roleName={selectedRole?.name}
      />
    </section>
  );
};

export default CreateRole;
