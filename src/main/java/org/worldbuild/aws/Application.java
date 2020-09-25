package org.worldbuild.aws;

import lombok.Data;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.worldbuild.aws.service.EmailService;
import org.worldbuild.aws.service.EmailServiceImpl;
import org.worldbuild.aws.service.SnsService;
import org.worldbuild.core.config.CoreConfiguration;
import org.worldbuild.core.modal.EmailModal;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Data
@Log4j2
@SpringBootApplication
@Import({CoreConfiguration.class})
public class Application implements CommandLineRunner  {
	private static final String SENDER = "xyz@gmail.com";
	private static final String RECIPIENT = "abc@gmail.com";
	//
	private static final String SUBJECT = "Greetings From ISB";
	private static final String ATTACHMENT = "/home/insight/Downloads/PaymentReceipt.pdf";
	private static final String TEXT_CONTENT = "Please see the attached file for a list of customers to contact.";

	@Autowired
	private SnsService snsService;
	@Autowired
	private EmailService emailService;
	@Autowired
	@Qualifier("scheduledExecutorService")
	private ScheduledExecutorService scheduledExecutorService;

	public static void main(String[] args) {
		log.info("Application is initializing..........");
		SpringApplication.run(Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		scheduledExecutorService.scheduleWithFixedDelay(()-> doJob(),10L,10L, TimeUnit.SECONDS);
		log.info("Triggering init ..............");
		EmailModal emailModal=new EmailModal();
		emailModal.setFrom(SENDER);
		emailModal.setTo(RECIPIENT);
		emailModal.setSubject(SUBJECT);
		emailModal.setContent(TEXT_CONTENT);
		emailModal.setTemplateFilePath("email/general");
		emailModal.setAttachment(ATTACHMENT);
		Map<String, Object> model = new HashMap<String, Object>();
		model.put("name", "Saurabh!");
		model.put("location", "Delhi, India");
		model.put("sign", "Saurabh Singh");
		emailModal.setModal(model);
		//emailService.sendEmail(emailModal);
		//snsService.publishToTopic("arn:aws:sns:ap-southeast-1:969695673397:MONGO_ALERT","AWS SNS Service testing");
	}

	public void doJob() {
		log.info("Current DATE & TIME ===> {}",new Date());
	}

}
