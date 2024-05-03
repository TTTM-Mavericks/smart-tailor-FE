import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import { CustomButton } from "../../../components";
import { fadeAnimation, slideAnimation } from "../../../config/MotionSetting";
import state from "../../../store";
import styles from './Designer.module.scss';

const ImageEditor = () => {
    const snap = useSnapshot(state);

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                <motion.div className={styles.customButtonContainer} {...slideAnimation}>
                    <CustomButton type={"filled"} title={"Designer"} handleClick={() => state.intro = true} customStyles={styles.customButtonContainer__switchScreenButton} />
                </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ImageEditor;