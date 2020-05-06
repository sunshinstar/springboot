package demo;

import org.apache.commons.lang3.StringUtils;

/**
 * @author liuhai
 * @date 2020/4/30 11:31
 */
public class Test {
    public static void main(String[] args) {

        Student student = new Student();
        if (StringUtils.isNotBlank(student.getName())) {
            System.out.println("11111111111");
        }else{
            System.out.println("2222222222");
        }

    }
}
