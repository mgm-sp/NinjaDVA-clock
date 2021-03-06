# -*- mode: ruby -*-
# vi: set ft=ruby :

# ninjaDVA clock

def provisionFile(config, from, to, options={mode: "775"})
	config.vm.provision "file", source: from, destination: "/tmp/#{File.basename(from)}"
	config.vm.provision "shell", inline: "install -m #{options[:mode]} /tmp/#{File.basename(from)} #{to}"
end

Vagrant.configure("2") do |config|
	config.vm.define "clock"

	# deactivate the standard shared folder
	config.vm.synced_folder ".", "/vagrant", disabled:true

	# name and version of vm image
	config.vm.box = "bento/debian-10"

	#set hostname for vm
	config.vm.hostname = "clock"
	ENV['LC_ALL']="en_US.UTF-8"

	config.vm.provision "shell", inline: "mkdir -p /var/www && chmod a+rwX /var/www"
	config.vm.provision "shell", inline: "rm -rf /var/www/clock"
	config.vm.provision "file", source: "./www", destination: "/var/www/clock"
	config.vm.provision "shell", inline: "chmod go-w -R /var/www"

	provisionFile(config,"nodejs-ws","/var/www/")

	config.vm.provision "shell", inline: <<-END
			apt-get -y update
			apt-get -y install dirmngr webfs
			apt-key adv --recv-keys 1655A0AB68576280
			echo "deb http://deb.nodesource.com/node_12.x buster main" > /etc/apt/sources.list.d/nodejs.list
			apt-get -y update
			apt-get -y install nodejs
			cd /var/www
			npm install ws
			npm install winston@next
			npm install pm2 -g
			pm2 startup
			pm2 start nodejs-ws
			pm2 save
	END
	provisionFile(config,"webfsd.conf","/etc/", mode: 660)
	config.vm.provision "shell", inline: "service webfs restart"

	if File.exists?("../ninjadva.rb")
		config.trigger.before :up do
			# generate dashboard files
			require "erb"
			["dashboard-admin/clockadmin","dashboard-widgets/clockwidget"].each{|basename|
				File.open("ninjadva/#{basename}.html","w"){|target| target << ERB.new(File.read("ninjadva/#{basename}.html.erb")).result }
			}
		end
		require "../ninjadva"
		NinjaDVA.new(config, link_widget_links: [])
	end
end
