//
//  ChartsView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import SwiftUI

struct DailyTasksView: View {
    var interactor: DailyTasksBusinessLogic?

    @ObservedObject var viewModel = DailyTasksViewModel()

    var body: some View {
        if viewModel.isLoaded {
            GeometryReader { geo in
                VStack(spacing: 20) {
                    Spacer()

//                    Text("算数")
//                        .padding()
//                        .padding(.leading, 32)
//                        .font(.system(size: 28))
//                        .frame(width: geo.size.width, height: 48, alignment: .leading)
//                        .background(Color.maths)
//                        .foregroundColor(Color.white)
//
//                    Dailytasks(target: viewModel.mathsTarget, completed: viewModel.mathsArchive)
//                        .padding(.leading, 32)

                    Text("理科")
                        .padding()
                        .padding(.leading, 32)
                        .font(.system(size: 28))
                        .frame(width: geo.size.width, height: 48, alignment: .leading)
                        .background(Color.science)
                        .foregroundColor(Color.white)

                    Dailytasks(target: viewModel.sciTarget, completed: viewModel.sciArchive)
                        .padding(.leading, 32)

                    Text("社会")
                        .padding()
                        .padding(.leading, 32)
                        .font(.system(size: 28))
                        .frame(width: geo.size.width, height: 48, alignment: .leading)
                        .background(Color.society)
                        .foregroundColor(Color.white)

                    Dailytasks(target: viewModel.socTarget, completed: viewModel.socArchive)
                        .padding(.leading, 32)

                    Text("国語")
                        .padding()
                        .padding(.leading, 32)
                        .font(.system(size: 28))
                        .frame(width: geo.size.width, height: 48, alignment: .leading)
                        .background(Color.language)
                        .foregroundColor(Color.white)

                    Dailytasks(target: viewModel.lanTarget, completed: viewModel.lanArchive)
                        .padding(.leading, 32)

                    Spacer()
                }
            }
            .onDisappear {
                viewModel.isLoaded = false
            }
        } else {
            Text("Loading...")
                .onAppear {
                    interactor?.load()
                }
        }
    }
}

extension DailyTasksView: DailyTasksDisplayLogic {
    func showTasks(model: DailyTasksViewModel) {
        viewModel.lanTarget = model.lanTarget
        viewModel.lanArchive = model.lanArchive
        viewModel.sciTarget = model.sciTarget
        viewModel.sciArchive = model.sciArchive
        viewModel.socTarget = model.socTarget
        viewModel.socArchive = model.socArchive
        viewModel.isLoaded = true
    }
}

extension DailyTasksView {
    func configureView() -> some View {
        var view = self
        let interactor = DailyTasksInteractor()
        let presenter = DailyTasksPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct ChartsView_Previews: PreviewProvider {
    static var previews: some View {
        DailyTasksView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
